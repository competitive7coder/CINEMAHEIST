from fastapi import APIRouter, HTTPException, Query
import httpx
import asyncio
import traceback
import re
from app.config import settings

router = APIRouter(prefix="/stream", tags=["Stream"])

TMDB_API_KEY = settings.TMDB_API_KEY

HINDI_KEYWORDS = ["hindi", "hin", "dual audio", "multi audio", "dubbed"]


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


def is_hindi_stream(title: str) -> bool:
    t = title.lower()
    return any(kw in t for kw in HINDI_KEYWORDS)


def extract_seeds(title: str) -> int:
    match = re.search(r"👤\s*(\d+)", title)
    return int(match.group(1)) if match else 0


async def get_torrentio_streams(imdb_id: str, language: str = "en") -> dict:
    """
    Returns direct streams (debrid), magnet streams (WebTorrent/app),
    and whether Hindi dubbed exists at all.
    """
    empty = {"direct_streams": [], "magnet_streams": [], "hindi_available": False}
    if not imdb_id:
        return empty

    try:
        url = f"https://torrentio.strem.fun/stream/movie/{imdb_id}.json"
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url)
            if not res.text.strip():
                return empty
            try:
                data = res.json()
            except Exception:
                print(f"Torrentio bad JSON for {imdb_id}")
                return empty

        streams = data.get("streams", [])
        direct_streams = []
        magnet_streams = []

        for s in streams:
            raw_url   = s.get("url", "")
            info_hash = s.get("infoHash", "")
            title     = s.get("title", "")
            name      = s.get("name", "")

            if not raw_url and not info_hash:
                continue

            quality  = extract_quality(title)
            is_hindi = is_hindi_stream(title)
            seeds    = extract_seeds(title)
            clean_title = title.split("\n")[0]

            # Build magnet from infoHash if needed
            magnet_url = None
            if raw_url.startswith("magnet:"):
                magnet_url = raw_url
            elif info_hash:
                dn = clean_title.replace(" ", "+")
                magnet_url = (
                    f"magnet:?xt=urn:btih:{info_hash}&dn={dn}"
                    f"&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337"
                    f"&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce"
                    f"&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969"
                )

            stream_obj = {
                "name":      name,
                "title":     clean_title,
                "quality":   quality,
                "is_hindi":  is_hindi,
                "seeds":     seeds,
                "info_hash": info_hash,
            }

            # Direct HTTPS (debrid-backed)
            if raw_url.startswith("https://") or "/playback/" in raw_url:
                direct_streams.append({**stream_obj, "url": raw_url, "type": "direct"})

            # Magnet — WebTorrent can stream these in browser
            if magnet_url:
                magnet_streams.append({**stream_obj, "url": magnet_url, "type": "magnet"})

        # Sort by quality then seeds
        order = {"4K": 0, "1080p": 1, "720p": 2, "480p": 3, "HD": 4}
        direct_streams.sort(key=lambda x: (order.get(x["quality"], 4), -x["seeds"]))
        magnet_streams.sort(key=lambda x: (order.get(x["quality"], 4), -x["seeds"]))

        all_streams     = direct_streams + magnet_streams
        hindi_available = any(s["is_hindi"] for s in all_streams)

        # Hindi filter — only return Hindi streams
        if language == "hi":
            magnet_streams = [s for s in magnet_streams if s["is_hindi"]]
            direct_streams = [s for s in direct_streams if s["is_hindi"]]

        return {
            "direct_streams":  direct_streams[:5],
            "magnet_streams":  magnet_streams[:8],
            "hindi_available": hindi_available,
        }

    except Exception as e:
        print(f"Torrentio error: {e}")
        return {"direct_streams": [], "magnet_streams": [], "hindi_available": False}


def build_embed_sources(imdb_id: str, tmdb_id: str, language: str = "en") -> list:
    id_to_use = imdb_id or tmdb_id
    if language == "hi":
        return [
            # autoembed.cc — dual audio, select Hindi track inside player
            {"name": "AutoEmbed",  "label": "Dual Audio", "type": "embed", "url": f"https://autoembed.cc/movie/tmdb/{tmdb_id}",       "verified": True},
            # letsembed — claims dubbed audio
            {"name": "LetsEmbed", "label": "Try Hindi",   "type": "embed", "url": f"https://letsembed.cc/embed/movie/?id={tmdb_id}", "verified": False},
        ]
    return [
        {"name": "Server 1", "label": "HD",         "type": "embed", "url": f"https://vidsrc.cc/v2/embed/movie/{id_to_use}",          "verified": False},
        {"name": "Server 2", "label": "Multi-Lang", "type": "embed", "url": f"https://vidsrc.me/embed/movie/{imdb_id or ''}?lang=en", "verified": False},
        {"name": "Server 3", "label": "HD",         "type": "embed", "url": f"https://player.videasy.net/movie/{tmdb_id}?lang=en",    "verified": False},
        {"name": "Server 4", "label": "Multi-Lang", "type": "embed", "url": f"https://moviesapi.club/movie/{id_to_use}",              "verified": False},
        {"name": "Server 5", "label": "HD",         "type": "embed", "url": f"https://autoembed.co/movie/imdb/{id_to_use}",           "verified": False},
        {"name": "Server 6", "label": "HD",         "type": "embed", "url": f"https://www.2embed.skin/embed/{id_to_use}",             "verified": False},
    ]


@router.get("/test")
async def test_stream():
    return {
        "status":           "ok",
        "tmdb_key_set":     bool(TMDB_API_KEY),
        "tmdb_key_preview": TMDB_API_KEY[:6] + "..." if TMDB_API_KEY else None,
    }


@router.get("/sources/{tmdb_id}")
async def get_movie_sources(
    tmdb_id: str,
    language: str = Query("en", description="en or hi"),
):
    try:
        if not TMDB_API_KEY:
            raise HTTPException(status_code=500, detail="TMDB_API_KEY not set")

        imdb_id = await get_imdb_id(tmdb_id)
        print(f"tmdb_id={tmdb_id}, imdb_id={imdb_id}, language={language}")

        torrent_result = await get_torrentio_streams(imdb_id, language) if imdb_id else {
            "direct_streams": [], "magnet_streams": [], "hindi_available": False
        }

        embed_sources    = build_embed_sources(imdb_id, tmdb_id, language)
        direct_streams   = torrent_result["direct_streams"]
        magnet_streams   = torrent_result["magnet_streams"]
        hindi_available  = torrent_result["hindi_available"]

        # Hindi not available = user wants Hindi but no Hindi torrent found at all
        hindi_not_available = language == "hi" and not hindi_available

        return {
            "tmdb_id":             tmdb_id,
            "imdb_id":             imdb_id,
            "language":            language,
            "embed_sources":       embed_sources,
            "direct_streams":      direct_streams,
            "magnet_streams":      magnet_streams,
            "has_direct":          len(direct_streams) > 0,
            "has_magnets":         len(magnet_streams) > 0,
            "hindi_available":     hindi_available,
            "hindi_not_available": hindi_not_available,
            "not_available":       imdb_id is None,
            "warning":             "Movie not available yet." if imdb_id is None else None,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"get_movie_sources error: {traceback.format_exc()}")
        return {
            "tmdb_id":             tmdb_id,
            "imdb_id":             None,
            "language":            language,
            "embed_sources":       build_embed_sources(None, tmdb_id, language),
            "direct_streams":      [],
            "magnet_streams":      [],
            "has_direct":          False,
            "has_magnets":         False,
            "hindi_available":     False,
            "hindi_not_available": False,
            "not_available":       False,
            "warning":             None,
        }