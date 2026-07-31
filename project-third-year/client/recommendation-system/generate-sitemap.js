/**
 * generate-sitemap.js
 *
 * Fetches movies from TMDB and generates a sitemap.xml into public/
 *
 * HOW TO USE:
 *   1. Add TMDB_API_KEY or REACT_APP_TMDB_API_KEY to .env.development
 *   2. Run:  node generate-sitemap.js
 *   3. It creates:  public/sitemap.xml  automatically
 *
 * AUTOMATIC (recommended):
 *   "build": "node generate-sitemap.js && react-scripts build"
 *   Now every deploy auto-generates a fresh sitemap!
 */

const https = require("https");
const fs    = require("fs");
const path  = require("path");

// ─── Load .env.development automatically (no extra packages needed) ───
const envPath = fs.existsSync(path.join(__dirname, ".env.development"))
  ? path.join(__dirname, ".env.development")
  : path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return; 
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key   = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  });
  console.log("📁 Loaded env from: " + path.basename(envPath));
} else {
  console.log("⚠️  No .env file found — using system environment variables");
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY || "YOUR_TMDB_API_KEY_HERE";
const BASE_URL     = "https://www.cinemaheist.online";
const OUTPUT_PATH  = path.join(__dirname, "public", "sitemap.xml");
const TOTAL_PAGES  = 500; // 500 pages x 20 movies = 10,000 movies
const BATCH_SIZE   = 20;  // fetch 20 pages at a time (safe rate limit)
// ─────────────────────────────────────────────

// Static pages
const STATIC_URLS = [
  { loc: "/",             changefreq: "daily",   priority: "1.0" },
  { loc: "/popular",      changefreq: "daily",   priority: "0.9" },
  { loc: "/search",       changefreq: "weekly",  priority: "0.8" },
  // Genre pages — high value for SEO
  { loc: "/genre/28",     changefreq: "daily",   priority: "0.85" }, // Action
  { loc: "/genre/12",     changefreq: "daily",   priority: "0.85" }, // Adventure
  { loc: "/genre/16",     changefreq: "daily",   priority: "0.85" }, // Animation
  { loc: "/genre/35",     changefreq: "daily",   priority: "0.85" }, // Comedy
  { loc: "/genre/80",     changefreq: "daily",   priority: "0.85" }, // Crime
  { loc: "/genre/18",     changefreq: "daily",   priority: "0.85" }, // Drama
  { loc: "/genre/27",     changefreq: "daily",   priority: "0.85" }, // Horror
  { loc: "/genre/10749",  changefreq: "daily",   priority: "0.85" }, // Romance
  { loc: "/genre/878",    changefreq: "daily",   priority: "0.85" }, // Sci-Fi
  { loc: "/genre/53",     changefreq: "daily",   priority: "0.85" }, // Thriller
  { loc: "/faq",          changefreq: "monthly", priority: "0.6" },
  { loc: "/contact",      changefreq: "monthly", priority: "0.5" },
  { loc: "/about",        changefreq: "monthly", priority: "0.5" },
  { loc: "/dmca",         changefreq: "yearly",  priority: "0.4" },
  { loc: "/privacy",      changefreq: "yearly",  priority: "0.4" },
  { loc: "/terms",        changefreq: "yearly",  priority: "0.4" },
  { loc: "/disclaimer",   changefreq: "yearly",  priority: "0.4" },
];

// ─── Helpers ───────────────────────────────────

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

async function fetchMoviePage(page) {
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=" + TMDB_API_KEY + "&sort_by=popularity.desc&page=" + page + "&language=en-US";
  try {
    const data = await httpsGet(url);
    return data.results || [];
  } catch {
    return [];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return "\n  <url>\n    <loc>" + BASE_URL + loc + "</loc>" +
    (lastmod ? "\n    <lastmod>" + lastmod + "</lastmod>" : "") +
    "\n    <changefreq>" + changefreq + "</changefreq>" +
    "\n    <priority>" + priority + "</priority>" +
    "\n  </url>";
}

// ─── Main ──────────────────────────────────────

async function generateSitemap() {
  if (TMDB_API_KEY === "YOUR_TMDB_API_KEY_HERE") {
    console.error("\n❌  TMDB API key not found!");
    console.error("    Add this to your .env.development file:");
    console.error("    TMDB_API_KEY=your_key_here");
    console.error("    OR: REACT_APP_TMDB_API_KEY=your_key_here\n");
    process.exit(1);
  }

  // Show which key name was found
  const keySource = process.env.TMDB_API_KEY ? "TMDB_API_KEY" : "REACT_APP_TMDB_API_KEY";
  console.log("🔑 API key source : " + keySource);

  const today = new Date().toISOString().split("T")[0];
  console.log("\n🚀 CinemaHeist Sitemap Generator");
  console.log("   Base URL   : " + BASE_URL);
  console.log("   Output     : " + OUTPUT_PATH);
  console.log("   TMDB pages : " + TOTAL_PAGES + " (~" + (TOTAL_PAGES * 20) + " movies)\n");

  // Static entries
  console.log("📄 Adding static pages...");
  const staticEntries = STATIC_URLS.map(u =>
    urlEntry(u.loc, today, u.changefreq, u.priority)
  ).join("");

  // Fetch movies in batches
  const allMovies = [];
  const seen = new Set();

  for (let start = 1; start <= TOTAL_PAGES; start += BATCH_SIZE) {
    const end   = Math.min(start + BATCH_SIZE - 1, TOTAL_PAGES);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    process.stdout.write("🎬 Fetching pages " + start + "-" + end + " / " + TOTAL_PAGES + "...");

    const results = await Promise.all(pages.map(fetchMoviePage));
    let added = 0;

    for (const movies of results) {
      for (const movie of movies) {
        if (!seen.has(movie.id)) {
          seen.add(movie.id);
          allMovies.push(movie);
          added++;
        }
      }
    }

    console.log(" ✓ " + added + " new movies (total: " + allMovies.length + ")");
    if (end < TOTAL_PAGES) await sleep(250);
  }

  // Build movie entries
  console.log("\n✍️  Building XML for " + allMovies.length + " movies...");
  const movieEntries = allMovies.map(movie => {
    const lastmod = movie.release_date ? movie.release_date.substring(0, 10) : today;
    return urlEntry("/movie/" + movie.id, lastmod, "monthly", "0.8");
  }).join("");

  // Assemble XML
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n' +
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n' +
    staticEntries + "\n" +
    movieEntries + "\n" +
    "</urlset>";

  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");

  const sizeKB = Math.round(fs.statSync(OUTPUT_PATH).size / 1024);
  console.log("\n✅ Done!");
  console.log("   File : " + OUTPUT_PATH);
  console.log("   Size : " + sizeKB + " KB");
  console.log("   URLs : " + (STATIC_URLS.length + allMovies.length) + " total\n");
  console.log("🔗 Submit to Google Search Console:");
  console.log("   " + BASE_URL + "/sitemap.xml\n");
}

generateSitemap().catch(err => {
  console.error("❌ Sitemap generation failed:", err.message);
  process.exit(1);
});