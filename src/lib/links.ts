export const APP_LOGIN_URL = "https://app.snoodlr.com/en/login";
export const AR_APP_LOGIN_URL = "https://app.snoodlr.com/ar/login";
export const WORDPRESS_PLUGIN_URL = "https://wordpress.org/plugins/snoodlr-ai-assistant-for-woocommerce/";

export type SiteLang = "en" | "ar";

export const SITE_URL = "https://snoodlr.com";

export function appLoginUrl(lang: SiteLang = "en") {
  return lang === "ar" ? AR_APP_LOGIN_URL : APP_LOGIN_URL;
}

export function localizedPath(lang: SiteLang, path: "/" | "/pricing" | "/contact") {
  if (lang === "en") return path;
  return path === "/" ? "/ar/" : `/ar${path}`;
}

export function englishPathFromCurrent(path: string) {
  if (path === "/ar" || path === "/ar/") return "/";
  if (path.startsWith("/ar/")) return path.slice(3) || "/";
  return path || "/";
}

export function languageSwitchPath(lang: SiteLang, currentPath: string) {
  const englishPath = englishPathFromCurrent(currentPath) as "/" | "/pricing" | "/contact";
  return localizedPath(lang === "ar" ? "en" : "ar", englishPath);
}

export function canonicalPath(path: string) {
  if (path === "/" || path === "/ar/" || path === "/ar") return path === "/ar" ? "/ar/" : path;
  return path.replace(/\/$/, "");
}
