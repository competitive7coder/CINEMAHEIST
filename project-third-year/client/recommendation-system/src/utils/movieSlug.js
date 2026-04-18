export const toMovieSlug = (movie) => {
  const title = (movie.title || "movie")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const year = movie.release_date?.split("-")[0] || "";
  return `${title}-${year}`;
};

export const toMovieSlugWithId = (movie) => {
  return `${toMovieSlug(movie)}-${movie.id}`;
};