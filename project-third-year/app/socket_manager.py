import os
import socketio

_debug = os.getenv("SOCKET_DEBUG", "false").lower() == "true"

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[],     # FastAPI CORSMiddleware handles CORS
    engineio_logger=_debug,
    logger=_debug,

    # Ping/timeout tuning — default ping_timeout=20s is too short for slow
    # connections or when the server is busy during startup.
    ping_timeout=60,             # wait 60s for pong before dropping client (default 20)
    ping_interval=25,            # send ping every 25s (default 25 — fine)
    max_http_buffer_size=1_000_000,
)


@sio.event
async def connect(sid, environ, auth):
    print(f"[Socket] ✅ Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"[Socket] ❌ Client disconnected: {sid}")


@sio.event
async def join_room(sid, data):
    user_id = data.get("userId") or data.get("user_id")
    if user_id:
        await sio.enter_room(sid, str(user_id))
        print(f"[Socket] {sid} joined room {user_id}")