import { useEffect } from "react";

/**
 * useSEO — dynamically updates <title>, <meta>, og/twitter tags, and JSON-LD per page.
 *
 * Usage on movie page:
 *   useSEO({
 *     title: "Watch Avengers: Endgame Free Online",
 *     description: "Watch Avengers: Endgame online free on StreamHub. No subscription needed.",
 *     image: "https://image.tmdb.org/t/p/w1280/poster.jpg",
 *     url: "/movie/299534",
 *     type: "video.movie",
 *     movie: {
 *       name: "Avengers: Endgame",
 *       description: "...",
 *       image: "https://image.tmdb.org/t/p/w1280/poster.jpg",
 *       datePublished: "2019-04-26",
 *       director: "Anthony Russo",
 *       genre: ["Action", "Adventure"],
 *       rating: 8.4,
 *       ratingCount: 25000,
 *     }
 *   });
 */

const BASE_URL = "https://stream1hub.pages.dev";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = "StreamHub";

const setMeta = (selector, content, attr = "content") => {
  if (!content) return;
  let el = document.querySelector(selector);
  if (!el) {
    // Create element based on selector type
    el = document.createElement("meta");
    if (selector.includes("property=")) {
      el.setAttribute("property", selector.match(/property="([^"]+)"/)[1]);
    } else if (selector.includes("name=")) {
      el.setAttribute("name", selector.match(/name="([^"]+)"/)[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, content);
};

const setCanonical = (url) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
};

const setStructuredData = (data) => {
  let el = document.querySelector('script[data-dynamic-ld]');
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-dynamic-ld", "true");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

const buildMovieSchema = (movie, fullUrl, fullImage) => ({
  "@context": "https://schema.org",
  "@type": "Movie",
  "name": movie.name,
  "description": movie.description || "",
  "url": fullUrl,
  "image": fullImage,
  "datePublished": movie.datePublished || "",
  "director": movie.director
    ? { "@type": "Person", "name": movie.director }
    : undefined,
  "genre": movie.genre || [],
  "aggregateRating": movie.rating
    ? {
        "@type": "AggregateRating",
        "ratingValue": movie.rating,
        "ratingCount": movie.ratingCount || 100,
        "bestRating": "10",
        "worstRating": "1",
      }
    : undefined,
  "potentialAction": {
    "@type": "WatchAction",
    "target": fullUrl,
  },
});

const useSEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  movie = null, // pass movie object for movie pages
}) => {
  useEffect(() => {
    // For movie pages, prefix with "Watch ... Free Online" for better CTR
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Watch Movies Online Free`;

    const fullDescription =
      description ||
      "Watch movies online free with AI-powered recommendations. Stream the latest Hollywood and world cinema on StreamHub.";

    const fullImage = image || DEFAULT_IMAGE;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    // Title
    document.title = fullTitle;

    // Primary meta
    setMeta('meta[name="description"]',   fullDescription);
    setMeta('meta[name="title"]',         fullTitle);

    // Canonical
    setCanonical(fullUrl);

    // Open Graph
    setMeta('meta[property="og:title"]',       fullTitle);
    setMeta('meta[property="og:description"]', fullDescription);
    setMeta('meta[property="og:image"]',       fullImage);
    setMeta('meta[property="og:url"]',         fullUrl);
    setMeta('meta[property="og:type"]',        type);
    setMeta('meta[property="og:site_name"]',   SITE_NAME);

    // Twitter
    setMeta('meta[name="twitter:title"]',       fullTitle);
    setMeta('meta[name="twitter:description"]', fullDescription);
    setMeta('meta[name="twitter:image"]',       fullImage);
    setMeta('meta[name="twitter:card"]',        "summary_large_image");

    // Structured data — Movie schema if on a movie page
    if (movie) {
      setStructuredData(buildMovieSchema(movie, fullUrl, fullImage));
    } else {
      // Default WebSite schema
      setStructuredData({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": BASE_URL,
        "description": fullDescription,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${BASE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      });
    }

    return () => {
      document.title = `${SITE_NAME} — Watch Movies Online Free`;
      setMeta('meta[name="description"]', "Watch movies online free with AI-powered recommendations.");
      setCanonical(BASE_URL);
      setMeta('meta[property="og:title"]',       `${SITE_NAME} — Watch Movies Online Free`);
      setMeta('meta[property="og:description"]', "Watch movies online free with AI-powered recommendations.");
      setMeta('meta[property="og:image"]',       DEFAULT_IMAGE);
      setMeta('meta[property="og:url"]',         BASE_URL);
      setMeta('meta[property="og:type"]',        "website");
    };
}, [title, description, image, url, type, movie]);
};

export default useSEO;