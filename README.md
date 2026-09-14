# Leifline

## Source of truth
The website is now a conventional static build. Source files live in `src/` and
shared browser assets live in `assets/`.

To rebuild the English and Swedish pages after changing `src/content.json` or
`src/build.mjs`:

```bash
node src/build.mjs
```

The generated pages are `index.html`, `sv/index.html`, `privacy/index.html`, and
`sv/integritet/index.html`. Unlike the previous exported bundle, all public copy
is present in the initial HTML and can be read without JavaScript.

## Language selection
`/` is the canonical English edition and `/sv/` is the canonical Swedish edition.
The language selector uses ordinary links, so it also works without JavaScript.

## Form
The form submits to Google Apps Script through a hidden iframe. The server must
generate the case ID and send a verified `postMessage` response before the website
shows a successful registration. See `apps-script/Code.gs.example` for the required
backend behavior. Do not merge the rebuild until the deployed Apps Script supports
that response.

## Search indexing
`robots.txt`, `sitemap.xml`, canonical links, bilingual `hreflang` links, social
metadata, and Organization structured data are included. Add the domain and submit
the sitemap in Google Search Console after deployment.
