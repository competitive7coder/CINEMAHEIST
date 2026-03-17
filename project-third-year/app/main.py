import os
import httpx
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.socket_manager import sio
from app.config import settings
from app.db.base import init_db
from app.api.v1.api import api_router
from dotenv import load_dotenv


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
    import asyncio
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

    yield

    await app.state.http_client.aclose()
    print("💤 Shutting down...")

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    description="Backend API for StreamHub Movie Platform",
    docs_url="/docs" if os.getenv("DOCS_ENABLED", "true").lower() == "true" else None,
    redoc_url=None,
)

print("FRONTEND_URL:", FRONTEND_URL)

# ── Step 1: Register CORS middleware first ────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://streamhub-research.vercel.app",
        "http://localhost:3000",  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Step 2: Wrap sio in ASGIApp exactly once, then mount ─────────────────────
# IMPORTANT: Mounted ASGI sub-apps bypass FastAPI's middleware stack (including
# CORSMiddleware). Passing `other_asgi_app=app` routes non-socket requests back
# through the full FastAPI app so CORS headers are correctly applied everywhere.
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