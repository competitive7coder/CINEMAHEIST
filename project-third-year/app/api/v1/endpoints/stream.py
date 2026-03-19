from fastapi import APIRouter, HTTPException
import httpx
import asyncio
import traceback
from app.config import settings

router = APIRouter(prefix="/stream", tags=["Stream"])

TMDB_API_KEY = settings.TMDB_API_KEY


async def get_imdb_id(tmdb_id: str):
    try:
        url = f"https://api.themoviedb.org/3/movie/{tmdb_id}/external_ids"
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url, params={"api_key": TMDB_API_KEY})
            data = res.json()
            return data.get("imdb_id")
    except Exception as e:
        print(f"get_imdb_id error: {e}")
        return None


def extract_quality(title: str) -> str:
    t = title.upper()
    if "2160P" in t or "4K" in t: return "4K"
    elif "1080P" in t:             return "1080p"
    elif "720P" in t:              return "720p"
    elif "480P" in t:              return "480p"
    return "HD"


async def get_torrentio_streams(imdb_id: str) -> list:
    if not imdb_id:
        return []
    try:
        url = f"https://torrentio.strem.fun/stream/movie/{imdb_id}.json"
        async with httpx.AsyncClient(timeout=8) as client:
            res = await client.get(url)
            if not res.text.strip():
                return []
            data = res.json()
            streams = data.get("streams", [])

            result = []
            for s in streams:
                raw_url = s.get("url", "")
                if not raw_url:
                    continue
                if "magnet:" in raw_url:
                    continue
                if raw_url.startswith("https://") or "/playback/" in raw_url:
                    result.append({
                        "name":    s.get("name", ""),
                        "title":   s.get("title", "").split("\n")[0],
                        "quality": extract_quality(s.get("title", "")),
                        "url":     raw_url,
                        "type":    "direct"
                    })

            order = {"4K": 0, "1080p": 1, "720p": 2, "480p": 3, "HD": 4}
            result.sort(key=lambda x: order.get(x["quality"], 4))
            return result[:5]

    except Exception as e:
        print(f"Torrentio error: {e}")
        return []


@router.get("/test")
async def test_stream():
    return {
        "status":            "ok",
        "tmdb_key_set":      bool(TMDB_API_KEY),
        "tmdb_key_preview":  TMDB_API_KEY[:6] + "..." if TMDB_API_KEY else None
    }


@router.get("/sources/{tmdb_id}")
async def get_movie_sources(tmdb_id: str):
    try:
        if not TMDB_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="TMDB_API_KEY not set"
            )

        imdb_id = await get_imdb_id(tmdb_id)

        print(f"tmdb_id={tmdb_id}, imdb_id={imdb_id}")

        torrentio_streams = await get_torrentio_streams(imdb_id) if imdb_id else []

        embed_sources = []

        if imdb_id:
            embed_sources = [
                {
                    "name":     "Server 1",
                    "label":    "HD",
                    "type":     "embed",
                    "url":      f"https://vidsrc.cc/v2/embed/movie/{imdb_id}",
                    "verified": False
                },
                {
                    "name":     "Server 2",
                    "label":    "Multi-Lang",
                    "type":     "embed",
                    "url":      f"https://vidsrc.me/embed/movie/{imdb_id}",
                    "verified": False
                },
                {
                    "name":     "Server 3",
                    "label":    "HD",
                    "type":     "embed",
                    "url":      f"https://player.videasy.net/movie/{tmdb_id}",
                    "verified": False
                },
                {
                    "name":     "Server 4",
                    "label":    "Multi-Lang",
                    "type":     "embed",
                    "url":      f"https://moviesapi.club/movie/{imdb_id}",
                    "verified": False
                },
                {
                    "name":     "Server 5",
                    "label":    "HD",
                    "type":     "embed",
                    "url":      f"https://autoembed.co/movie/imdb/{imdb_id}",
                    "verified": False
                },
                {
                    "name":     "Server 6",
                    "label":    "HD",
                    "type":     "embed",
                    "url":      f"https://www.2embed.skin/embed/{imdb_id}",
                    "verified": False
                },
            ]
        else:
            # Fallback to TMDB ID if IMDB lookup failed
            print(f"WARNING: No IMDB ID for tmdb_id={tmdb_id}")
            embed_sources = [
                {"name": "Server 1", "label": "HD",         "type": "embed", "url": f"https://vidsrc.cc/v2/embed/movie/{tmdb_id}",        "verified": False},
                {"name": "Server 2", "label": "Multi-Lang", "type": "embed", "url": f"https://vidsrc.me/embed/movie?tmdb={tmdb_id}",       "verified": False},
                {"name": "Server 3", "label": "HD",         "type": "embed", "url": f"https://player.videasy.net/movie/{tmdb_id}",         "verified": False},
                {"name": "Server 4", "label": "Multi-Lang", "type": "embed", "url": f"https://moviesapi.club/movie/{tmdb_id}",             "verified": False},
                {"name": "Server 5", "label": "HD",         "type": "embed", "url": f"https://autoembed.co/movie/imdb/{tmdb_id}",          "verified": False},
                {"name": "Server 6", "label": "HD",         "type": "embed", "url": f"https://www.2embed.skin/embed/{tmdb_id}",            "verified": False},
            ]

        # Only mark not_available if IMDB ID itself not found
        not_available = imdb_id is None and len(torrentio_streams) == 0

        return {
            "tmdb_id":        tmdb_id,
            "imdb_id":        imdb_id,
            "embed_sources":  embed_sources,
            "direct_streams": torrentio_streams,
            "has_direct":     len(torrentio_streams) > 0,
            "not_available":  not_available,
            "warning":        "This movie may not be available yet." if not_available else None
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"get_movie_sources error: {traceback.format_exc()}")
        # Always return something so frontend doesn't break
        return {
            "tmdb_id": tmdb_id,
            "imdb_id": None,
            "embed_sources": [
                {"name": "Server 1", "label": "HD",         "type": "embed", "url": f"https://vidsrc.cc/v2/embed/movie/{tmdb_id}",   "verified": False},
                {"name": "Server 2", "label": "Multi-Lang", "type": "embed", "url": f"https://vidsrc.me/embed/movie?tmdb={tmdb_id}", "verified": False},
                {"name": "Server 3", "label": "HD",         "type": "embed", "url": f"https://player.videasy.net/movie/{tmdb_id}",   "verified": False},
                {"name": "Server 4", "label": "Multi-Lang", "type": "embed", "url": f"https://moviesapi.club/movie/{tmdb_id}",       "verified": False},
                {"name": "Server 5", "label": "HD",         "type": "embed", "url": f"https://autoembed.co/movie/imdb/{tmdb_id}",    "verified": False},
                {"name": "Server 6", "label": "HD",         "type": "embed", "url": f"https://www.2embed.skin/embed/{tmdb_id}",      "verified": False},
            ],
            "direct_streams": [],
            "has_direct":     False,
            "not_available":  False,
            "warning":        None
        } 