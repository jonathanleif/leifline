(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const lang = document.documentElement.lang === "sv" ? "sv" : "en";

  const navToggle = $(".nav-toggle");
  const nav = $(".site-nav");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = String(open);
  });
  $$(".site-nav a").forEach(link => link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    if (nav) nav.dataset.open = "false";
  }));

  const rates = [3,3,4,2,1,0,1,1,2,2,2,2,2,2,2,2,3,3,3,3,4,4,5,5];
  const hash = n => { let h=n>>>0; h^=h<<13; h>>>=0; h^=h>>17; h^=h<<5; return h>>>0; };
  const group = n => new Intl.NumberFormat(lang === "sv" ? "sv-SE" : "en-GB").format(n);
  function updateLoad() {
    const d = new Date(), h=d.getHours(), min=d.getMinutes(), sec=d.getSeconds();
    const day=Math.floor(Date.now()/86400000); let closed=0;
    for(let i=0;i<h;i++) closed+=rates[i];
    closed=Math.floor(closed+rates[h]*(min/60));
    const slot=Math.floor((h*60+min)/7), r=hash(day*1471+slot)%100;
    const ongoing=r<rates[h]*9?(r%3===0?2:1):0;
    const queue=ongoing?hash(day+slot*7)%3:0;
    const into=(h*60+min)*60+sec-slot*7*60;
    const values={ongoing,closed,queue,since:`${String(Math.floor(into/60)).padStart(2,"0")}:${String(into%60).padStart(2,"0")}`,oldest:group(Math.floor((Date.now()-Date.UTC(2019,1,11,18,3))/86400000))};
    for(const [key,value] of Object.entries(values)){const el=$(`[data-load="${key}"]`);if(el)el.textContent=value;}
    const clock=$("[data-clock]");
    if(clock){const p=n=>String(n).padStart(2,"0"),sep=lang==="sv"?".":":";clock.textContent=`${lang==="sv"?"LOKAL TID":"LOCAL TIME"} ${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(h)}${sep}${p(min)}${sep}${p(sec)}`;clock.dateTime=d.toISOString();}
  }
  updateLoad(); setInterval(updateLoad,1000);

  const reveal=$("[data-reveal-cases]");
  reveal?.addEventListener("click",()=>{ $$(".case-card[hidden]").forEach(card=>card.hidden=false); reveal.remove(); });

  $$("[data-dialog-open]").forEach(button=>button.addEventListener("click",()=>{
    const dialog=document.getElementById(button.dataset.dialogOpen); if(!dialog)return;
    dialog.showModal(); document.body.classList.add("modal-open");
  }));
  $$(".press-dialog").forEach(dialog=>{
    $("[data-dialog-close]",dialog)?.addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
    dialog.addEventListener("close",()=>document.body.classList.remove("modal-open"));
  });

  const form=$("#case-form");
  if(form){
    const natureInputs=$$('input[name="natureChoice"]',form), severityInputs=$$('input[name="severityChoice"]',form);
    const submit=$(".form-submit",form), error=$(".form-error",form);
    const labels={
      sending:lang==="sv"?"ÖVERFÖR…":"TRANSMITTING…",
      incomplete:lang==="sv"?"FYLL I AVSNITT A–C FÖR ATT REGISTRERA":"COMPLETE SECTIONS A–C TO SUBMIT",
      ready:lang==="sv"?"REGISTRERA ÄRENDE":"SUBMIT CASE",
      timeout:lang==="sv"?"Ärendet skickades men kunde inte bekräftas. Försök igen eller kontakta help@leifline.com.":"The case was sent but could not be confirmed. Try again or contact help@leifline.com.",
      failed:lang==="sv"?"Ärendet kunde inte registreras. Försök igen.":"The case could not be registered. Please try again."
    };
    let pendingNonce="", timeout;
    const selected=name=>$(`input[name="${name}"]:checked`,form);
    function updateForm(){
      const nature=selected("natureChoice"),severity=selected("severityChoice"),urgent=severity?.dataset.urgent==="true";
      $("[data-classification]").textContent=nature?.dataset.classification||(lang==="sv"?"AVVAKTAR AVSNITT A":"AWAITING SECTION A");
      $("[data-handling]").textContent=severity?(urgent?(lang==="sv"?"SAMMA KVÄLL":"SAME EVENING"):(lang==="sv"?"INOM 2–14 HANDLÄGGNINGSÖGONBLICK":"WITHIN 2–14 PROCESSING MOMENTS")):(lang==="sv"?"AVVAKTAR AVSNITT B":"AWAITING SECTION B");
      $("[data-recommendation]").textContent=nature?(urgent?(lang==="sv"?"AGERA INTE INNAN DU BLIVIT KONTAKTAD":"DO NOT ACT BEFORE BEING CONTACTED"):(lang==="sv"?"VIDTA INGA OÅTERKALLELIGA ÅTGÄRDER":"TAKE NO IRREVERSIBLE ACTION")):(lang==="sv"?"FYLL I AVSNITT A":"COMPLETE SECTION A");
      submit.disabled=!form.checkValidity(); submit.textContent=submit.disabled?labels.incomplete:labels.ready;
    }
    form.addEventListener("input",updateForm); form.addEventListener("change",updateForm); updateForm();
    form.addEventListener("submit",event=>{
      event.preventDefault(); if(!form.reportValidity())return;
      const nature=selected("natureChoice"),severity=selected("severityChoice");
      form.elements.nature.value=nature.value; form.elements.severity.value=severity.value;
      form.elements.natureCode.value=nature.dataset.code; form.elements.severityCode.value=severity.dataset.code; form.elements.classification.value=nature.dataset.classification;
      pendingNonce=crypto.randomUUID(); form.elements.submissionNonce.value=pendingNonce;
      submit.disabled=true; submit.textContent=labels.sending; error.hidden=true;
      clearTimeout(timeout); timeout=setTimeout(()=>{pendingNonce="";error.textContent=labels.timeout;error.hidden=false;updateForm();},20000);
      HTMLFormElement.prototype.submit.call(form);
    });
    window.addEventListener("message",event=>{
      const trusted=event.origin==="https://script.google.com"||event.origin.endsWith(".googleusercontent.com");
      const data=event.data; if(!trusted||!data||data.type!=="leifline-submission"||data.nonce!==pendingNonce)return;
      clearTimeout(timeout); pendingNonce="";
      if(!data.ok){error.textContent=data.error||labels.failed;error.hidden=false;updateForm();return;}
      form.hidden=true; const receipt=$("#receipt"); receipt.hidden=false; $("[data-receipt-id]").textContent=data.caseId;
      const urgent=selected("severityChoice")?.dataset.urgent==="true";
      const rows=lang==="sv"?[["STATUS","REGISTRERAT"],["PRIORITET",urgent?"FÖRHÖJD":"NORMAL"],["KÖ",`PLATS ${data.queue||"—"}`],["HANDLÄGGARE","J. L. SVENSSON"],["ÖVERKLAGANDERÄTT","TEKNISKT SETT"]]:[["STATUS","REGISTERED"],["PRIORITY",urgent?"ELEVATED":"STANDARD"],["QUEUE",`POSITION ${data.queue||"—"}`],["REVIEWER","J. L. SVENSSON"],["RIGHT OF APPEAL","TECHNICALLY"]];
      $("[data-receipt-table]").innerHTML=rows.map(([k,v])=>`<div class="receipt-row"><span>${escapeText(k)}</span><span>${escapeText(v)}</span></div>`).join(""); receipt.focus?.();
    });
    $("[data-reset-form]")?.addEventListener("click",()=>{form.reset();form.hidden=false;$("#receipt").hidden=true;updateForm();form.scrollIntoView({behavior:"smooth",block:"start"});});
  }

  function escapeText(value){const span=document.createElement("span");span.textContent=String(value??"");return span.innerHTML;}
  const statusEl=$("#status-content"), results=$("[data-lookup-results]"), lookupInput=$("[data-lookup-input]");
  if(statusEl&&results&&lookupInput){
    const data=JSON.parse(statusEl.textContent);
    const stringHash=value=>{let h=0;for(const c of value)h=(h*31+c.charCodeAt(0))>>>0;return h;};
    function renderRows(rows){results.innerHTML=rows.map(([k,v])=>`<div class="register-row"><dt>${escapeText(k)}</dt><dd>${escapeText(v)}</dd></div>`).join("");}
    renderRows(data.empty);
    function lookup(){const key=lookupInput.value.trim().toUpperCase();if(!key){renderRows(data.empty);return;}const rec=data.cases[key];if(rec)renderRows([[data.kRef,key],[data.kReg,rec.reg],[data.kCat,rec.cat],[data.kStatus,rec.status],[data.kFinding,rec.finding],[data.kOutcome,rec.outcome],[data.kAppeal,rec.appeal]]);else{const h=hash(stringHash(key));renderRows([[data.kRef,key],[data.kStatus,data.generic[h%data.generic.length]],[data.kFinding,data.gFinding],[data.kOutcome,data.gOutcome],[data.kAppeal,data.gAppeal]]);}}
    $("[data-lookup-button]")?.addEventListener("click",lookup); lookupInput.addEventListener("keydown",event=>{if(event.key==="Enter")lookup();});
  }
})();
