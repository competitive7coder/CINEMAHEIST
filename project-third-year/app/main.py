import os
import httpx
import asyncio
import socketio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.socket_manager import sio
from app.config import settings
from app.db.base import init_db
from app.api.v1.api import api_router
from dotenv import load_dotenv


# ── Timeout Middleware ────────────────────────────────────────────────────────
# Skip timeout for SSE + slow endpoints
SKIP_TIMEOUT_PATHS = [
    "/homepage-sections/stream",   # SSE — streams forever by design
    "/recommendations/user",        # ML engine — slow on first run
    "/watchlist/full",              # parallel TMDB calls — can be slow
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to MongoDB...")
    await init_db()
    print(f"🚀 {settings.PROJECT_NAME} is live on MongoDB")

    app.state.http_client = httpx.AsyncClient(
        base_url="https://api.themoviedb.org/3",
        timeout=httpx.Timeout(20.0)
    )

    # Pre-warm homepage cache + train ML model in background
    from app.api.v1.endpoints.movies import get_homepage_sections
    from app.ml.engine import build_collaborative_model

    async def warm_cache():
        await asyncio.sleep(2)  # wait for app.state.http_client to be ready
        try:
            await get_homepage_sections()
            print("✅ Homepage cache warmed")
        except Exception as e:
            print(f"⚠️  Cache warm failed: {e}")

    async def train_ml():
        await asyncio.sleep(3)  # wait for DB to be fully ready
        try:
            import pandas as pd
            import numpy as np
            from pathlib import Path
            from app.models.activity import Activity
            from app.ml.engine import (
                _collab_user_factors, _collab_movie_factors,
                _collab_user_index,   _collab_movie_index,
            )
            import app.ml.engine as engine_module

            MODEL_DIR   = Path("app/ml/model_cache")
            MODEL_DIR.mkdir(exist_ok=True)
            CACHE_FILE  = MODEL_DIR / "svd_model.npz"
            INDEX_FILE  = MODEL_DIR / "svd_index.pkl"

            # ── Fast path: load pre-trained model from disk ───────────────────
            if CACHE_FILE.exists() and INDEX_FILE.exists():
                import pickle
                data = np.load(CACHE_FILE, allow_pickle=False)
                engine_module._collab_user_factors  = data["user_factors"]
                engine_module._collab_movie_factors = data["movie_factors"]
                with open(INDEX_FILE, "rb") as f:
                    idx = pickle.load(f)
                engine_module._collab_user_index  = idx["user_index"]
                engine_module._collab_movie_index = idx["movie_index"]
                print(f"✅ SVD model loaded from cache — "
                      f"{len(idx['user_index']):,} users, "
                      f"{len(idx['movie_index']):,} movies")

                # Still load real user logs on top (fast — only 1 user)
                logs      = await Activity.find_all().to_list()
                real_logs = [
                    {
                        "user_id":     str(a.user_id.ref.id) if hasattr(a.user_id, 'ref') else str(a.user_id),
                        "movie_id":    a.movie_id,
                        "action_type": a.action_type,
                    }
                    for a in logs
                ]
                if real_logs:
                    build_collaborative_model(real_logs)
                    print(f"✅ Real user model updated — {len(real_logs)} logs")
                return

            # ── Slow path: train from scratch + save cache ────────────────────
            # Only runs ONCE — after that always uses cache above
            print("ℹ️  No model cache found — training from scratch (one-time, ~2 min)...")

            logs      = await Activity.find_all().to_list()
            real_logs = [
                {
                    "user_id":     str(a.user_id.ref.id) if hasattr(a.user_id, 'ref') else str(a.user_id),
                    "movie_id":    a.movie_id,
                    "action_type": a.action_type,
                }
                for a in logs
            ]
            print(f"ℹ️  Real user logs: {len(real_logs)}")

            ml_logs_path = Path("app/ml/ml_activity_logs.csv")
            if ml_logs_path.exists():
                ml_df   = pd.read_csv(ml_logs_path)
                ml_logs = ml_df.to_dict("records")
                print(f"ℹ️  MovieLens logs: {len(ml_logs):,}")
            else:
                ml_logs = []
                print("⚠️  ml_activity_logs.csv not found — run movielens_to_streamhub.py")

            all_logs = real_logs + ml_logs
            if all_logs:
                build_collaborative_model(all_logs)

                # Save trained model to disk so next startup is instant
                if engine_module._collab_user_factors is not None:
                    import pickle
                    np.savez_compressed(
                        CACHE_FILE,
                        user_factors=engine_module._collab_user_factors,
                        movie_factors=engine_module._collab_movie_factors,
                    )
                    with open(INDEX_FILE, "wb") as f:
                        pickle.dump({
                            "user_index":  engine_module._collab_user_index,
                            "movie_index": engine_module._collab_movie_index,
                        }, f)
                    print(f"✅ SVD model cached to disk → {CACHE_FILE}")
                    print("ℹ️  Next restart will load instantly from cache")
            else:
                print("ℹ️  No activity data — collaborative model skipped")

        except Exception as e:
            print(f"⚠️  ML training failed: {e}")

    asyncio.create_task(warm_cache())
    asyncio.create_task(train_ml())

    async def keep_db_warm():
        # Ping MongoDB every 4 minutes — prevents Atlas free tier idle timeout
        import asyncio as _asyncio
        from app.models.user import User as _User
        while True:
            try:
                await _asyncio.sleep(240)
                await _User.find_one()
            except Exception:
                pass

    asyncio.create_task(keep_db_warm())

    yield

    await app.state.http_client.aclose()
    print("💤 Shutting down...")

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173, http://localhost:4173/")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="Backend API for StreamHub Movie Platform",
    docs_url="/docs" if os.getenv("DOCS_ENABLED", "true").lower() == "true" else None,
    redoc_url=None,
)

print("FRONTEND_URL:", FRONTEND_URL)

# ── Rate Limiting — blocks abuse & bot scraping ───────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["500/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Step 1: GZip compression — shrinks responses by 60-80% ──────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── Step 2: Trusted Host — blocks fake/spoofed Host header attacks ────────────
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "streamhub-research.onrender.com",  # production
        "*.onrender.com",                    # Render internal health checks
        "localhost",                         # local dev
        "127.0.0.1",                         # local dev
    ]
)

# ── Step 3: Register CORS middleware ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://stream1hub.pages.dev",   # Cloudflare Pages deployment
        "http://localhost:5173",           # local dev
        "http://localhost:4173",           # local testing dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request size limit — blocks oversized payloads (max 1MB) ─────────────────
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        size = int(content_length)
        # Allow 5MB for profile picture uploads
        if "/profile" in request.url.path or "/upload" in request.url.path:
            if size > 5_000_000:  # 5MB
                return JSONResponse(
                    {"error": "Image too large — max 5MB allowed"},
                    status_code=413
                )
        # Everything else max 1MB
        elif size > 1_000_000:
            return JSONResponse(
                {"error": "Request too large — max 1MB allowed"},
                status_code=413
            )
    return await call_next(request)



# ── Security headers — hides server info, hardens API responses ──────────────
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["server"] = ""  # hide server info
    return response

# ── Request timeout — registered before routes ───────────────────────────────
@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    if any(p in request.url.path for p in SKIP_TIMEOUT_PATHS):
        return await call_next(request)
    try:
        return await asyncio.wait_for(call_next(request), timeout=25.0)
    except asyncio.TimeoutError:
        return JSONResponse(
            {"error": "Request timeout — please try again"},
            status_code=504
        )
    except RuntimeError:
        # Starlette middleware race condition — pass through safely
        return await call_next(request)

# ── Socket.IO mount ───────────────────────────────────────────────────────────
socket_app = socketio.ASGIApp(sio, socketio_path="")
app.mount("/socket.io", socket_app)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "Online",
        "message": "StreamHub API is running smoothly",
        "docs": "/docs"
    }


app.include_router(api_router, prefix=settings.API_V1_STR)