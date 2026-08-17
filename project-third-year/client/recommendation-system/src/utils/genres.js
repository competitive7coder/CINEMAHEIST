export const GENRE_MAP = {
  "action": 28,
  "adventure": 12,
  "animation": 16,
  "comedy": 35,
  "crime": 80,
  "drama": 18,
  "horror": 27,
  "romance": 10749,
  "sci-fi": 878,
  "thriller": 53
};

export const getGenreId = (slugOrId) => {
  if (!slugOrId) return null;
  const slug = slugOrId.toString().toLowerCase();
  return GENRE_MAP[slug] || (isNaN(slugOrId) ? null : parseInt(slugOrId));
};

export const getGenreSlug = (id) => {
  if (!id) return null;
  const numericId = parseInt(id);
  const entry = Object.entries(GENRE_MAP).find(([_, val]) => val === numericId);
  return entry ? entry[0] : id.toString();
};

export const getGenreName = (slugOrId) => {
  const id = getGenreId(slugOrId);
  const entry = Object.entries(GENRE_MAP).find(([_, val]) => val === id);
  if (!entry) return "Genre";
  const slug = entry[0];
  if (slug === "sci-fi") return "Sci-Fi";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};
