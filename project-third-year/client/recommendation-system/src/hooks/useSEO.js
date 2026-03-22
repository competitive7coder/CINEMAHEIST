import { useEffect } from "react";

/**
 * useSEO — dynamically updates <title>, <meta>, and og/twitter tags per page.
 * No extra packages needed — pure DOM manipulation.
 *
 * Usage:
 *   useSEO({
 *     title: "Avengers: Endgame — StreamHub",
 *     description: "Watch Avengers: Endgame online free on StreamHub.",
 *     image: "https://image.tmdb.org/t/p/w1280/poster.jpg",
 *     url: "https://streamhub-research.vercel.app/movie/299534",
 *     type: "video.movie",  // optional, defaults to "website"
 *   });
 */

const BASE_URL = "https://streamhub-research.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = "StreamHub";

const setMeta = (name, content, isProperty = false) => {
  if (!content) return;
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
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

const useSEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  structuredData = null,
}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Watch Movies Online Free`;

    const fullDescription = description ||
      "Watch movies online free with AI-powered recommendations. Stream the latest Hollywood and world cinema on StreamHub.";

    const fullImage = image || DEFAULT_IMAGE;
    const fullUrl   = url ? `${BASE_URL}${url}` : BASE_URL;

    // Title
    document.title = fullTitle;

    // Primary
    setMeta("description", fullDescription);

    // Canonical
    setCanonical(fullUrl);

    // Open Graph
    setMeta("og:title",       fullTitle,       true);
    setMeta("og:description", fullDescription, true);
    setMeta("og:image",       fullImage,       true);
    setMeta("og:url",         fullUrl,         true);
    setMeta("og:type",        type,            true);
    setMeta("og:site_name",   SITE_NAME,       true);

    // Twitter
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", fullDescription);
    setMeta("twitter:image",       fullImage);
    setMeta("twitter:card",        "summary_large_image");

    // Structured data
    if (structuredData) setStructuredData(structuredData);

    // Cleanup: reset to defaults on unmount
    return () => {
      document.title = `${SITE_NAME} — Watch Movies Online Free`;
      setMeta("description", "Watch movies online free with AI-powered recommendations. Stream the latest Hollywood and world cinema on StreamHub.");
      setMeta("og:title",       `${SITE_NAME} — Watch Movies Online Free`, true);
      setMeta("og:description", "Watch movies online free with AI-powered recommendations.", true);
      setMeta("og:image",       DEFAULT_IMAGE, true);
      setMeta("og:url",         BASE_URL,      true);
      setMeta("og:type",        "website",     true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, url]);
};

export default useSEO;