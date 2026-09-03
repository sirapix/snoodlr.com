import { SITE_URL, type SiteLang } from "./links";

export const SITE_NAME = "Snoodlr";
export const SITE_DESCRIPTION =
  "Snoodlr is an AI business assistant and unified inbox that answers customer questions from approved business content, captures leads, supports order requests, and helps teams manage customer messages and comments from connected channels in one place.";
export const SITE_EMAIL = "hello@snoodlr.com";
export const SITE_UPDATED = "2026-06-11";
export const OG_IMAGE_PATH = "/og/snoodlr-og.png";
export const OG_IMAGE_WIDTH = 1920;
export const OG_IMAGE_HEIGHT = 1080;

export const DEFAULT_KEYWORDS = [
  "AI business assistant",
  "AI customer support",
  "AI lead capture",
  "unified inbox",
  "social media inbox",
  "social media comment management",
  "website chatbot",
  "business chatbot",
  "WooCommerce AI assistant",
  "WordPress chatbot",
  "customer conversation automation",
  "Snoodlr"
];

export const PUBLIC_PAGE_PATHS = ["/", "/pricing", "/faq", "/contact", "/ar/", "/ar/pricing", "/ar/faq", "/ar/contact"] as const;

type DefaultStructuredDataOptions = {
  canonical: string;
  title: string;
  description: string;
  lang: SiteLang;
  path: string;
  dateModified?: string;
};

export function getDefaultStructuredData({ canonical, title, description, lang, path, dateModified = SITE_UPDATED }: DefaultStructuredDataOptions) {
  const logo = new URL("/assets/snoodlr-logo.png", SITE_URL).toString();
  const ogImage = new URL(OG_IMAGE_PATH, SITE_URL).toString();
  const homeUrl = new URL(lang === "ar" ? "/ar/" : "/", SITE_URL).toString();
  const pageName = title.split(" - ")[0];

  const graph: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: logo,
        width: 512,
        height: 512
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: SITE_EMAIL,
        contactType: "customer support",
        availableLanguage: ["English", "Arabic"]
      },
      description: SITE_DESCRIPTION
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "ar"],
      publisher: {
        "@id": `${SITE_URL}/#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: lang,
      dateModified,
      isPartOf: {
        "@id": `${SITE_URL}/#website`
      },
      publisher: {
        "@id": `${SITE_URL}/#organization`
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImage,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT
      }
    }
  ];

  if (path !== "/" && path !== "/ar/") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: lang === "ar" ? "الرئيسية" : "Home",
          item: homeUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageName,
          item: canonical
        }
      ]
    });
  }

  return graph;
}
