const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");

const ensureTrailingSlash = (value = "") =>
  value.endsWith("/") ? value : `${value}/`;

export const resolvePublicUrl = (relativePath = "") => {
  if (!relativePath) return "";

  // Do not rewrite absolute or data/blob URLs.
  if (/^(?:[a-z]+:)?\/\//i.test(relativePath)) return relativePath;
  if (/^(?:data|blob):/i.test(relativePath)) return relativePath;

  const base = import.meta.env.BASE_URL || "/";
  const target = trimLeadingSlash(relativePath);

  // If the base is relative (e.g., "./"), we need to resolve it against the current window origin
  // to prevent relative path breakage when moving between directory levels (like in an iframe).
  if (base === "./") {
    return new URL(target, window.location.origin).pathname;
  }

  const cleanBase = ensureTrailingSlash(base);
  return `${cleanBase}${target}`;
};

export default resolvePublicUrl;