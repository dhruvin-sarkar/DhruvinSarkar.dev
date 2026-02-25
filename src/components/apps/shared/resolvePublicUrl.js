const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");

const ensureTrailingSlash = (value = "") =>
  value.endsWith("/") ? value : `${value}/`;

export const resolvePublicUrl = (relativePath = "") => {
  if (!relativePath) return "";

  // Do not rewrite absolute or data/blob URLs.
  if (/^(?:[a-z]+:)?\/\//i.test(relativePath)) return relativePath;
  if (/^(?:data|blob):/i.test(relativePath)) return relativePath;

  const base = ensureTrailingSlash(import.meta.env.BASE_URL || "/");
  const target = trimLeadingSlash(relativePath);

  return `${base}${target}`;
};

export default resolvePublicUrl;
