# Leifline — publishing notes

## Source of truth
`Leifline.dc.html` in the project root. Never edit `site/index.html` by hand — it is compiled.

## Upload to GitHub Pages (jonathanleif/leifline)
Upload the contents of `site/` to the repo root:

```
index.html          ← English (default international edition)
sv/index.html       ← Swedish edition, served at /sv
images/og-leifline.png
images/favicon.svg
```

Photography and fonts are inlined in each index.html. The two files are identical;
`/sv/` serves Swedish because the edition is chosen from the URL path.

## Language selection
Priority order:
1. `?lang=sv` / `?lang=en` (the SV / EN selector in the header; the choice is remembered)
2. a `/sv` path segment
3. previously remembered choice
4. English

There is deliberately no redirect based on browser language.

## Form
Posts to the Google Apps Script endpoint. Payload: caseId, nature, severity, name,
place, time, account, acknowledged, language, natureCode, severityCode, classification,
source, website. `natureCode` (N1–N6) and `severityCode` (S1–S5) are stable across both
languages, so Swedish and English submissions stay in the same data categories.
