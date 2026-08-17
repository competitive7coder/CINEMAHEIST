"""
app/cache/redis.py

Upstash Redis cache helper using the HTTP REST API.
Uses httpx (already in your project) — no extra packages needed.
Never crashes your app if Redis is down — all errors are silently caught.
Gracefully degrades — if UPSTASH credentials not set, all cache calls are no-ops.

TTL constants (seconds):
    MOVIE_DETAIL_TTL    = 24 hours
    TRENDING_TTL        = 1 hour
    HOMEPAGE_TTL        = 6 hours
    RECOMMENDATIONS_TTL = 1 hour
    IMDB_ID_TTL         = 7 days
    STREAM_SOURCES_TTL  = 30 mins
"""

import json
import httpx
from app.config import settings

#  TTL constants 
MOVIE_DETAIL_TTL      = 86400    # 24 hours
TRENDING_TTL          = 3600     # 1 hour
HOMEPAGE_TTL          = 21600    # 6 hours
RECOMMENDATIONS_TTL   = 3600     # 1 hour
IMDB_ID_TTL           = 604800   # 7 days
STREAM_SOURCES_TTL    = 1800     # 30 minutes


def _is_configured() -> bool:
    """Returns True only if both Upstash env vars are set."""
    url   = getattr(settings, "UPSTASH_REDIS_REST_URL",   "") or ""
    token = getattr(settings, "UPSTASH_REDIS_REST_TOKEN", "") or ""
    return bool(url and token)


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.UPSTASH_REDIS_REST_TOKEN}",
        "Content-Type": "application/json",
    }


def _base() -> str:
    return settings.UPSTASH_REDIS_REST_URL.rstrip("/")


async def get_cache(key: str):
    """
    Returns cached Python object or None.
    Never raises — returns None on any error or if Redis not configured.
    """
    if not _is_configured():
        return None
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res  = await client.get(f"{_base()}/get/{key}", headers=_headers())
            body = res.json()
            val  = body.get("result")
            if val is None:
                return None
            return json.loads(val)
    except Exception as e:
        print(f"[Redis] get_cache({key}): {e}")
        return None


async def set_cache(key: str, value, ttl: int = 3600) -> bool:
    """
    Stores value with TTL. Uses /pipeline endpoint so large JSON
    objects are sent in the request body, not the URL.
    Returns True on success, False otherwise.
    """
    if not _is_configured():
        return False
    try:
        payload = json.dumps(value, default=str)
        async with httpx.AsyncClient(timeout=5.0) as client:
            res  = await client.post(
                f"{_base()}/pipeline",
                headers=_headers(),
                # Upstash pipeline: array of [COMMAND, arg1, arg2, ...]
                json=[["SET", key, payload, "EX", ttl]],
            )
            data = res.json()
            # Pipeline response: list of {"result": "OK"} objects
            if isinstance(data, list) and data:
                return data[0].get("result") == "OK"
            return False
    except Exception as e:
        print(f"[Redis] set_cache({key}): {e}")
        return False


async def delete_cache(key: str) -> bool:
    """Deletes a single cache key."""
    if not _is_configured():
        return False
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            res = await client.post(
                f"{_base()}/pipeline",
                headers=_headers(),
                json=[["DEL", key]],
            )
            return res.status_code == 200
    except Exception as e:
        print(f"[Redis] delete_cache({key}): {e}")
        return False


async def delete_pattern(pattern: str) -> None:
    """
    Deletes all keys matching pattern (e.g. 'user:recs:abc123:*').
    Uses KEYS command — fine for small datasets, avoid on huge key spaces.
    """
    if not _is_configured():
        return
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Find all matching keys
            res  = await client.post(
                f"{_base()}/pipeline",
                headers=_headers(),
                json=[["KEYS", pattern]],
            )
            data = res.json()
            keys = data[0].get("result", []) if isinstance(data, list) else []
            if not keys:
                return
            # Delete them all in one pipeline call
            await client.post(
                f"{_base()}/pipeline",
                headers=_headers(),
                json=[["DEL"] + keys],
            )
    except Exception as e:
        print(f"[Redis] delete_pattern({pattern}): {e}")