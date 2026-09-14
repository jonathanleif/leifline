import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"), "utf8"));
const endpoint = "https://script.google.com/macros/s/AKfycbyDSAOkkLKMbQ6T3r6CyZnwc1KDFL_lOuOTTvdHw4Ge9RLn33SiB02a6vkHlPqvAt6bMw/exec";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const e = escapeHtml;
const j = value => JSON.stringify(value).replaceAll("<", "\\u003c");

function nav(c, lang) {
  const active = lang === "sv";
  return `
  <a class="skip-link" href="#main">${active ? "Hoppa till innehållet" : "Skip to content"}</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#top" aria-label="Leifline"><span>LEIFLINE</span><span class="brand-dot" aria-hidden="true"></span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">${active ? "MENY" : "MENU"}</button>
      <nav class="site-nav" id="primary-nav" aria-label="${active ? "Huvudmeny" : "Primary navigation"}">
        <a href="#services">${e(c.nav.services)}</a><a href="#method">${e(c.nav.method)}</a><a href="#cases">${e(c.nav.cases)}</a><a href="#press">${e(c.nav.press)}</a><a href="#case">${e(c.nav.submit)}</a><a href="#about">${e(c.nav.about)}</a><a class="nav-contact" href="#contact">${e(c.nav.contact)}</a>
      </nav>
      <div class="language-switcher" aria-label="Language"><a href="/sv/"${active ? ' aria-current="page"' : ""}>SV</a><span aria-hidden="true">/</span><a href="/"${!active ? ' aria-current="page"' : ""}>EN</a></div>
    </div>
  </header>`;
}

function hero(c, lang) {
  return `<section class="hero" id="top" aria-labelledby="hero-title">
    <img src="/images/hero.webp" alt="" width="1600" height="1067" fetchpriority="high">
    <div class="wrap hero-inner"><div class="hero-copy">
      <div class="eyebrow">${e(c.hero.kicker)}</div><h1 id="hero-title">${e(c.hero.h1)}</h1><p>${e(c.hero.body)}</p>
      <div class="button-row"><a class="button button-primary" href="#case">${e(c.hero.cta1)}</a><a class="button button-light" href="#cases">${e(c.hero.cta2)}</a></div>
      <div class="hero-status"><div><span class="status-dot" aria-hidden="true"></span>${e(c.hero.status)}</div><div>${e(c.hero.avg)}</div><div>${e(c.hero.conditions)}<span data-condition>${lang === "sv" ? "NORMALA" : "NORMAL"}</span></div></div>
    </div></div>
  </section>`;
}

function loadStrip(c) {
  const stats = [["ongoing", c.load.ongoing], ["closed", c.load.closed], ["queue", c.load.queue], ["since", c.load.since], ["oldest", c.load.oldest]];
  return `<section class="load-strip" aria-labelledby="load-title"><div class="wrap">
    <div class="load-head"><div id="load-title"><span class="brand-dot" aria-hidden="true" style="display:inline-block;margin-right:9px"></span>${e(c.load.title)}</div><time data-clock></time></div>
    <div class="load-grid">${stats.map(([key,label],i)=>`<div><div class="load-number${i===0?" live":""}" data-load="${key}">0</div><div class="load-label">${e(label)}</div></div>`).join("")}</div>
    <div class="load-note">${e(c.load.note)}</div>
  </div></section>`;
}

function services(c) {
  return `<section class="section" id="services" aria-labelledby="services-title"><div class="wrap">
    <div class="section-heading-row"><div class="section-label">${e(c.svc.label)}</div><h2 class="section-heading" id="services-title">${e(c.svc.h2)}</h2></div>
    <div class="card-grid">${c.svc.items.map(x=>`<article class="card"><div class="card-code">${e(x.code)}</div><h3>${e(x.title)}</h3><p>${e(x.body)}</p></article>`).join("")}</div>
    <div class="text-columns">${c.svc.blocks.map(x=>`<article class="text-column"><h3>${e(x.title)}</h3><p>${e(x.body)}</p></article>`).join("")}</div>
  </div></section>`;
}

function method(c) {
  return `<section class="section dark" id="method" aria-labelledby="method-title"><div class="wrap">
    <div class="section-label">${e(c.method.label)}</div><h2 class="section-heading" id="method-title" style="max-width:820px;margin-top:30px">${e(c.method.h2)}</h2><p class="section-intro">${e(c.method.intro)}</p>
    <div class="method-steps">${c.method.steps.map(x=>`<article class="method-step"><div class="method-num">${e(x.num)}</div><h3>${e(x.title)}</h3><p>${e(x.body)}</p></article>`).join("")}</div>
    <p class="method-closing">${e(c.method.closing)}</p>
    <div class="method-detail"><figure style="margin:0"><img class="framed-image" src="/images/method.webp" alt="Leifline" width="1200" height="800" loading="lazy"><figcaption class="caption">${e(c.method.fig1a)}<br>${e(c.method.fig1b)}</figcaption></figure>
      <div><div class="timeline-title">${e(c.method.extract)}</div>${c.method.timeline.map(x=>`<div class="timeline-row"><time>${e(x.time)}</time><span>${e(x.event)}</span></div>`).join("")}<p class="method-closing">${e(c.method.dur)}<br>${e(c.method.words)}</p></div>
    </div>
    <div class="stats-grid">${c.method.stats.map(x=>`<div class="stat"><div class="stat-number">${e(x.n)}</div><div class="stat-label">${e(x.label)}</div></div>`).join("")}</div>
  </div></section>
  <section class="operations-image" aria-label="Leifline operations"><img src="/images/operations.webp" alt="" width="1600" height="900" loading="lazy"><div class="operations-caption"><div class="wrap">${e(c.band.a)}<br><span style="color:rgba(245,242,235,.5)">${e(c.band.b)}</span></div></div></section>`;
}

function cases(c) {
  return `<section class="section" id="cases" aria-labelledby="cases-title" style="background:var(--paper-dark)"><div class="wrap">
    <div class="section-heading-row"><div class="section-label">${e(c.cases.label)}</div><div><h2 class="section-heading" id="cases-title">${e(c.cases.h2)}</h2><p class="section-intro">${e(c.cases.intro)}</p></div></div>
    <div class="case-grid">${c.cases.items.map((x,i)=>`<article class="case-card"${i>2?" hidden":""}><div class="case-meta"><span>${e(x.ref)}</span><span>${e(x.place)}</span></div><h3>${e(x.title)}</h3><div class="case-row"><b>${e(c.cases.kSituation)}</b><span>${e(x.situation)}</span></div><div class="case-row"><b>${e(c.cases.kFinding)}</b><span>${e(x.finding)}</span></div><div class="case-row outcome"><b>${e(c.cases.kOutcome)}</b><span>${e(x.outcome)}</span></div><blockquote class="case-quote">${e(x.quote)}</blockquote></article>`).join("")}</div>
    <button class="button wide-button" type="button" data-reveal-cases>${e(c.cases.more)}</button><p class="archive-note">${e(c.cases.note)}</p>
  </div></section>`;
}

function press(c) {
  return `<section class="section" id="press" aria-labelledby="press-title"><div class="wrap">
    <div class="section-label" style="margin-bottom:40px">${e(c.press.label)}</div>
    <div class="press-top"><figure style="margin:0"><img class="framed-image" src="/images/press-briefing.webp" alt="Leifline" width="1200" height="800" loading="lazy" style="border-color:var(--line)"><figcaption class="caption" style="color:#8a8579">${e(c.press.fig3a)}<br>${e(c.press.fig3b)}</figcaption></figure>
      <div><h2 class="section-heading" id="press-title">${e(c.press.h2)}</h2>${c.press.items.map(x=>`<article class="press-list-item"><div class="press-list-meta"><span>${e(x.outlet)}</span><span>${e(x.date)}</span></div><div class="press-list-title">${e(x.headline)}</div><div class="press-list-copy">${e(x.standfirst)}</div></article>`).join("")}</div>
    </div>
    <div class="press-gallery"><div class="press-gallery-head"><div><div class="section-label" style="margin-bottom:9px">${e(c.press.galleryLabel)}</div><h3>${e(c.press.galleryTitle)}</h3></div><div class="section-label">${e(c.press.galleryHint)}</div></div>
      <div class="press-gallery-grid">${c.press.features.map(x=>`<article class="press-card"><button type="button" data-dialog-open="${e(x.modalId)}" aria-label="${e(x.openLabel)}"><img class="press-thumb" src="${e(x.thumb)}" alt="${e(x.alt)}" width="527" height="746" loading="lazy"><div class="press-card-copy"><div class="press-list-meta"><span>${e(x.outlet)}</span><span>${e(x.date)}</span></div><h4>${e(x.headline)}</h4><div class="press-open">${e(c.press.openArticle)}</div></div></button>
        <dialog class="press-dialog" id="${e(x.modalId)}" aria-label="${e(x.headline)}"><div class="dialog-bar"><span>${e(x.outlet)} · ${e(x.date)}</span><button class="dialog-close" type="button" data-dialog-close>${e(c.press.closeArticle)}</button></div><img src="${e(x.image)}" alt="${e(x.alt)}" width="1055" height="1491" loading="lazy"></dialog></article>`).join("")}</div>
    </div>
  </div></section>`;
}

const classification = {
  en: ["UNEXPLAINED EVENT", "CLARIFICATION REQUIRED", "DISPUTED OUTCOME", "DECISION WITH CONSEQUENCES", "PREVENTIVE ASSESSMENT", "UNCLASSIFIED"],
  sv: ["OFÖRKLARAD HÄNDELSE", "FÖRTYDLIGANDE KRÄVS", "OMSTRITT UTFALL", "BESLUT MED FÖLJDVERKNINGAR", "FÖREBYGGANDE BEDÖMNING", "EJ KLASSIFICERAT"]
};

function caseForm(c, lang) {
  const privacyUrl = lang === "sv" ? "/sv/integritet/" : "/privacy/";
  const privacy = lang === "sv" ? `Skicka inte känsliga personuppgifter. Läs hur Leifline <a href="${privacyUrl}">hanterar inskickade uppgifter</a>.` : `Do not submit sensitive personal data. Read how Leifline <a href="${privacyUrl}">handles submitted information</a>.`;
  return `<section class="section" id="case" aria-labelledby="form-title"><div class="wrap">
    <div class="section-heading-row"><div class="section-label">${e(c.form.label)}</div><div><h2 class="section-heading" id="form-title">${e(c.form.h2)}</h2><p class="section-intro">${e(c.form.body)}</p><p style="font:20px/1.45 var(--serif);margin:10px 0 0">${e(c.form.emph)}</p></div></div>
    <div class="case-form-shell">
      <form class="case-form" id="case-form" action="${endpoint}" method="post" target="submission-frame" data-lang="${lang}">
        <div class="form-column"><fieldset class="choice-grid"><legend class="form-section-title">${e(c.form.secA)}</legend>${c.form.natures.map((x,i)=>`<div class="choice"><input id="nature-${i}" name="natureChoice" type="radio" value="${e(x)}" data-code="N${i+1}" data-classification="${e(classification[lang][i])}" required><label for="nature-${i}">${e(x)}</label></div>`).join("")}</fieldset>
          <fieldset class="choice-grid"><legend class="form-section-title">${e(c.form.secB)}</legend>${c.form.severities.map((x,i)=>`<div class="choice"><input id="severity-${i}" name="severityChoice" type="radio" value="${e(x)}" data-code="S${i+1}" data-urgent="${i>=3}" required><label for="severity-${i}">${e(x)}</label></div>`).join("")}</fieldset></div>
        <div class="form-column"><div class="form-section-title">${e(c.form.secC)}</div><div class="field-grid">
          <label class="field">${e(c.form.fName)}<input name="name" placeholder="${e(c.form.pName)}" autocomplete="name" maxlength="100" required></label>
          <div class="field-grid two"><label class="field">${e(c.form.fPlace)}<input name="place" placeholder="${e(c.form.pPlace)}" maxlength="100" required></label><label class="field">${e(c.form.fTime)}<input name="time" placeholder="${e(c.form.pTime)}" maxlength="30" required></label></div>
          <div class="classification" aria-live="polite"><div>${e(c.form.kClass)} <span data-classification>${e(c.form.awaitA)}</span></div><div>${e(c.form.kHandling)} <span data-handling>${e(c.form.awaitB)}</span></div><div>${e(c.form.kRec)} <span data-recommendation>${e(c.form.recA)}</span></div></div>
          <label class="field">${e(c.form.fAccount)}<textarea name="account" rows="4" placeholder="${e(c.form.pAccount)}" maxlength="3000" required></textarea></label>
          <label class="checkbox"><input name="acknowledged" type="checkbox" value="Yes" required><span>${e(c.form.ack)}</span></label>
          <p class="privacy-note">${privacy}</p>
          <div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
          <input type="hidden" name="nature"><input type="hidden" name="severity"><input type="hidden" name="natureCode"><input type="hidden" name="severityCode"><input type="hidden" name="classification"><input type="hidden" name="language" value="${lang}"><input type="hidden" name="source" value="leifline.com"><input type="hidden" name="submissionNonce">
          <button class="button button-primary form-submit" type="submit" disabled>${e(c.form.btnIncomplete)}</button><div class="form-error" role="alert" hidden></div>
        </div></div>
      </form>
      <div class="receipt" id="receipt" hidden><div><div class="section-label" style="color:var(--red)">${e(c.form.okLabel)}</div><div class="receipt-id" data-receipt-id></div><p class="section-intro">${e(c.form.okBody)}</p><p class="archive-note">${e(c.form.okShort)}</p><button class="button" type="button" data-reset-form style="margin-top:30px">${e(c.form.okAgain)}</button></div><div class="receipt-table" data-receipt-table></div></div>
    </div><iframe name="submission-frame" title="Submission response" hidden></iframe>
  </div></section>`;
}

function status(c, lang) {
  return `<section class="section dark" id="status" aria-labelledby="status-title"><div class="wrap status-layout"><div><div class="section-label">${e(c.status.label)}</div><h2 class="section-heading" id="status-title" style="margin-top:28px">${e(c.status.h2)}</h2><p class="section-intro">${e(c.status.body)}</p><div class="lookup-controls"><input type="search" data-lookup-input placeholder="LL-2026-0482" aria-label="${e(c.status.kRef)}"><button class="button button-primary" type="button" data-lookup-button>${e(c.status.btn)}</button></div><p class="method-closing">${e(c.status.hint)}</p></div><div class="register-extract"><div class="register-title">${e(c.status.extract)}</div><dl data-lookup-results></dl></div></div>
    <script type="application/json" id="status-content" nonce="leifline-static-v1">${j(c.status)}</script>
  </section>`;
}

function aboutContactFooter(c, lang) {
  const privacyUrl = lang === "sv" ? "/sv/integritet/" : "/privacy/";
  const privacyLabel = lang === "sv" ? "INTEGRITET" : "PRIVACY";
  return `<section class="section dark" id="about" aria-labelledby="about-title"><div class="wrap"><div class="section-label" style="margin-bottom:52px">${e(c.about.label)}</div><div class="about-layout"><img class="about-image" src="/images/jonathan.webp" alt="Jonathan" width="1000" height="1000" loading="lazy"><div class="about-copy"><h2 class="section-heading" id="about-title">${e(c.about.h2)}</h2><p>${e(c.about.p1)}</p><p>${e(c.about.p2)}</p><div class="founder"><div class="founder-name">Jonathan</div><div class="founder-title">${e(c.about.title)}</div></div><div class="values-grid">${c.about.values.map(x=>`<article class="value"><h3>${e(x.k)}</h3><p>${e(x.v)}</p></article>`).join("")}</div></div></div></div></section>
  <section class="section red" id="contact" aria-labelledby="contact-title"><div class="wrap contact-layout"><div><h2 id="contact-title">${e(c.contact.h2)}</h2><p>${e(c.contact.body)}</p></div><div><div class="contact-item"><div class="contact-label">${e(c.contact.emailLabel)}</div><a class="contact-value" href="mailto:help@leifline.com">help@leifline.com</a></div><div class="contact-item"><div class="contact-label">${e(c.contact.phoneLabel)}</div><div class="contact-value">${e(c.contact.phone)}</div><p>${e(c.contact.phoneNote)}</p></div><div class="contact-item">${c.contact.hours.map(x=>`<div class="hours-row"><span>${e(x.k)}</span><span>${e(x.v)}</span></div>`).join("")}</div></div></div></section>
  <footer class="site-footer"><div class="wrap footer-grid"><div><div class="footer-brand">LEIFLINE</div><div class="footer-meta">${e(c.footer.place)}<br>${e(c.footer.est)}</div></div><nav class="footer-nav" aria-label="Footer"><a href="#services">${e(c.footer.l1)}</a><br><a href="#method">${e(c.footer.l2)}</a><br><a href="#cases">${e(c.footer.l3)}</a><br><a href="#press">${e(c.footer.l4)}</a></nav><div class="footer-copy">${e(c.footer.disclaimer)}<div class="footer-legal"><a href="${privacyUrl}">${privacyLabel}</a><br>${e(c.footer.copy)}<br>${e(c.footer.docver)}</div></div></div></footer>`;
}

function documentFor(lang) {
  const c = content[lang];
  const sv = lang === "sv";
  const canonical = sv ? "https://leifline.com/sv/" : "https://leifline.com/";
  const structured = {"@context":"https://schema.org","@type":"Organization","name":"Leifline","url":canonical,"logo":"https://leifline.com/images/og-leifline.png","founder":{"@type":"Person","name":"Jonathan"},"foundingDate":"2019","foundingLocation":{"@type":"Place","name":"Stockholm, Sweden"},"email":"help@leifline.com"};
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'nonce-leifline-static-v1'; frame-src https://script.google.com https://*.googleusercontent.com; form-action https://script.google.com"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${e(c.meta.title)}</title><meta name="description" content="${e(c.meta.desc)}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="https://leifline.com/"><link rel="alternate" hreflang="sv" href="https://leifline.com/sv/"><link rel="alternate" hreflang="x-default" href="https://leifline.com/"><link rel="icon" href="/images/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0b1420"><meta property="og:type" content="website"><meta property="og:site_name" content="Leifline"><meta property="og:locale" content="${sv?"sv_SE":"en_GB"}"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${e(c.meta.ogTitle)}"><meta property="og:description" content="${e(c.meta.desc)}"><meta property="og:image" content="https://leifline.com/images/og-leifline.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(c.meta.ogTitle)}"><meta name="twitter:description" content="${e(c.meta.desc)}"><meta name="twitter:image" content="https://leifline.com/images/og-leifline.png"><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json" nonce="leifline-static-v1">${j(structured)}</script><script src="/assets/site.js" defer></script></head><body>${nav(c,lang)}<main id="main">${hero(c,lang)}${loadStrip(c)}${services(c)}${method(c)}${cases(c)}${press(c)}${caseForm(c,lang)}${status(c,lang)}${aboutContactFooter(c,lang)}</main></body></html>`;
}

function legalDocument(lang) {
  const sv = lang === "sv", title = sv ? "Integritet — Leifline" : "Privacy — Leifline", canonical = sv ? "https://leifline.com/sv/integritet/" : "https://leifline.com/privacy/";
  const copy = sv ? `<h1>Så hanterar Leifline inskickade uppgifter.</h1><p>Leifline tar emot uppgifter som du själv lämnar i ärendeformuläret: namn, plats, tidpunkt, ärendekategori och din redogörelse. Uppgifterna används endast för att ta emot, bedöma och följa upp ditt ärende.</p><h2>Skicka inte känsliga uppgifter</h2><p>Lämna inte personnummer, kontouppgifter, medicinska uppgifter eller information om andra personer som inte behövs för ärendet.</p><h2>Lagring och åtkomst</h2><p>Uppgifterna lagras i Leiflines privata ärenderegister och är endast tillgängliga för Jonathan. De sparas inte längre än vad som är rimligt för handläggning och uppföljning.</p><h2>Dina frågor</h2><p>Kontakta <a href="mailto:help@leifline.com">help@leifline.com</a> om du vill fråga vilka uppgifter som finns registrerade eller begära att de tas bort.</p>` : `<h1>How Leifline handles submitted information.</h1><p>Leifline receives the information you choose to provide in the case form: your name, location, time, case category and account of the incident. It is used only to receive, assess and follow up your case.</p><h2>Do not submit sensitive information</h2><p>Do not provide national identification numbers, financial details, medical information or unnecessary information about other people.</p><h2>Storage and access</h2><p>Information is stored in Leifline’s private case register and is accessible only to Jonathan. It is not retained longer than reasonably necessary for handling and follow-up.</p><h2>Your questions</h2><p>Contact <a href="mailto:help@leifline.com">help@leifline.com</a> to ask what information is registered or request its deletion.</p>`;
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self'"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${title}</title><meta name="description" content="${sv?"Information om hur Leifline hanterar inskickade uppgifter.":"Information about how Leifline handles submitted information."}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="https://leifline.com/privacy/"><link rel="alternate" hreflang="sv" href="https://leifline.com/sv/integritet/"><link rel="stylesheet" href="/assets/styles.css"></head><body>${nav(content[lang],lang)}<main class="legal-page" id="main"><div class="wrap legal-copy">${copy}<p style="margin-top:48px"><a class="button" href="${sv?"/sv/":"/"}">${sv?"TILLBAKA TILL LEIFLINE":"BACK TO LEIFLINE"}</a></p></div></main></body></html>`;
}

fs.mkdirSync(path.join(root,"sv"),{recursive:true});
fs.mkdirSync(path.join(root,"privacy"),{recursive:true});
fs.mkdirSync(path.join(root,"sv/integritet"),{recursive:true});
fs.writeFileSync(path.join(root,"index.html"),documentFor("en"));
fs.writeFileSync(path.join(root,"sv/index.html"),documentFor("sv"));
fs.writeFileSync(path.join(root,"privacy/index.html"),legalDocument("en"));
fs.writeFileSync(path.join(root,"sv/integritet/index.html"),legalDocument("sv"));
console.log("Built English, Swedish, and privacy pages.");
