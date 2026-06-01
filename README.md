# snoodlr.com

Astro + Tailwind static marketing site for Snoodlr.

## Commands

```sh
npm install
npm run dev
npm run build
```

The public site includes English and Arabic home, pricing, and contact pages, plus static `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph metadata, and JSON-LD structured data.

## Contact Relay

The contact form posts to `/api/contact`, which sends messages to `motaz@sirapix.com` through Resend. Configure these server-side environment variables in production:

```sh
EMAIL_API_KEY=...
EMAIL_FROM="Snoodlr <hello@snoodlr.com>"
```

`RESEND_API_KEY` and `RESEND_FROM` are also supported as fallbacks.
