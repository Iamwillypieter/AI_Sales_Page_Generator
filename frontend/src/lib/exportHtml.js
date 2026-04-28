// Build a fully self-contained HTML file (CSS inlined) for export
function escape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n\n+/)
    .map((p) => `<p>${escape(p)}</p>`)
    .join("");
}

function modernHtml(c, product) {
  return `
  <section class="hero">
    <div class="container narrow center">
      <div class="badge">★ ${escape(product.name)}</div>
      <h1 class="display">${escape(c.headline)}</h1>
      <p class="lead">${escape(c.subheadline)}</p>
      <button class="btn-primary">${escape(c.cta?.primary || "Get started")}</button>
      <span class="muted small">${escape(c.cta?.secondary || "")}</span>
    </div>
  </section>
  <section class="container narrow"><div class="prose">${paragraphs(c.description)}</div></section>
  <section class="bg-soft pad-lg">
    <div class="container">
      <h2 class="h2 center">Why teams switch</h2>
      <div class="grid grid-3">
        ${(c.benefits || [])
          .map(
            (b) =>
              `<div class="card"><div class="dot"></div><h3>${escape(b.title)}</h3><p>${escape(b.description)}</p></div>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="container pad-lg">
    <h2 class="h2 center">Everything you need</h2>
    <div class="grid grid-2">
      ${(c.features || [])
        .map(
          (f) =>
            `<div class="card outline"><h3>${escape(f.title)}</h3><p>${escape(f.description)}</p></div>`
        )
        .join("")}
    </div>
  </section>
  <section class="bg-blue pad-lg">
    <div class="container">
      <div class="grid grid-3 mb-lg">
        ${(c.socialProof?.stats || [])
          .map((s) => `<div class="center"><div class="stat">${escape(s.value)}</div><div class="muted">${escape(s.label)}</div></div>`)
          .join("")}
      </div>
      <div class="grid grid-3">
        ${(c.socialProof?.testimonials || [])
          .map(
            (t) =>
              `<blockquote class="card"><p>"${escape(t.quote)}"</p><footer><strong>${escape(t.name)}</strong> · ${escape(t.role)}</footer></blockquote>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="container narrow center pad-lg">
    <h2 class="h2">${escape(c.pricing?.headline || "")}</h2>
    <div class="card pricing">
      <div class="price">${escape(c.pricing?.price || "")}</div>
      <div class="muted">${escape(c.pricing?.billing || "")}</div>
      <ul>${(c.pricing?.includes || []).map((i) => `<li>✓ ${escape(i)}</li>`).join("")}</ul>
      <button class="btn-primary block">${escape(c.cta?.primary || "Get started")}</button>
      <div class="muted small">${escape(c.pricing?.guarantee || "")}</div>
    </div>
  </section>
  <section class="bg-dark pad-lg center">
    <div class="container narrow">
      <div class="kicker">${escape(c.cta?.urgency || "")}</div>
      <h2 class="h2 light">${escape(c.headline)}</h2>
      <button class="btn-light">${escape(c.cta?.primary || "Get started")}</button>
    </div>
  </section>
  `;
}

const STYLES = `
* { box-sizing: border-box; }
body { margin:0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color:#0a0a0a; background:#fff; }
h1,h2,h3 { font-family: 'Outfit', sans-serif; letter-spacing:-0.02em; }
.container { max-width:1100px; margin:0 auto; padding: 0 24px; }
.container.narrow { max-width:780px; }
.center { text-align:center; }
.muted { color:#6b7280; }
.small { font-size: 0.875rem; }
.pad-lg { padding: 80px 0; }
.mb-lg { margin-bottom: 48px; }
.hero { padding:96px 0 64px; background: radial-gradient(ellipse at top, #DBEAFE, transparent 50%), radial-gradient(ellipse at bottom right, #E0E7FF, transparent 60%), #fff; }
.badge { display:inline-flex; gap:6px; align-items:center; background:#fff; border:1px solid #e5e7eb; border-radius:999px; padding:6px 14px; font-size:12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 24px; }
.display { font-size: clamp(36px, 6vw, 60px); font-weight:800; line-height:1.05; margin: 0 0 16px; }
.lead { font-size:18px; color:#525252; max-width:640px; margin:0 auto 28px; line-height:1.7; }
.btn-primary { background:#0a0a0a; color:#fff; padding:14px 28px; border-radius:16px; border:0; font-weight:600; cursor:pointer; }
.btn-primary.block { display:block; width:100%; padding:16px; }
.btn-light { background:#fff; color:#0a0a0a; padding:16px 32px; border:0; border-radius:16px; font-weight:600; cursor:pointer; }
.h2 { font-size: clamp(28px, 4vw, 40px); font-weight:700; margin: 0 0 40px; }
.h2.light { color:#fff; }
.bg-soft { background:#f9fafb; }
.bg-blue { background: linear-gradient(180deg, #EFF6FF, #fff); }
.bg-dark { background:#0a0a0a; color:#fff; }
.kicker { color:#93C5FD; text-transform:uppercase; letter-spacing:0.25em; font-size:12px; margin-bottom: 12px; }
.grid { display:grid; gap:16px; }
.grid-2 { grid-template-columns: 1fr; }
.grid-3 { grid-template-columns: 1fr; }
@media (min-width: 700px){ .grid-2 { grid-template-columns: 1fr 1fr; } .grid-3 { grid-template-columns: 1fr 1fr 1fr; } }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:24px; }
.card.outline { box-shadow:none; }
.card .dot { width:36px; height:36px; border-radius:12px; background:#DBEAFE; margin-bottom: 12px; }
.card h3 { margin: 0 0 8px; font-size: 18px; }
.card p { color:#525252; line-height:1.6; margin:0; }
.stat { font-size: 40px; font-weight: 800; color:#1d4ed8; font-family:'Outfit',sans-serif; }
.pricing { padding:32px; }
.price { font-size:56px; font-weight:800; font-family:'Outfit',sans-serif; }
.pricing ul { text-align:left; padding:0; list-style:none; max-width:380px; margin: 16px auto 24px; }
.pricing li { padding:6px 0; }
.prose { font-size:18px; line-height:1.8; color:#374151; }
.prose p { margin: 0 0 16px; }
`;

const STYLES_BOLD = `
* { box-sizing: border-box; }
body { margin:0; font-family:'Satoshi',system-ui,sans-serif; color:#000; background:#FFFCEC; }
h1,h2,h3 { font-family:'Cabinet Grotesk','Satoshi',sans-serif; letter-spacing:-0.03em; font-weight:900; }
.container { max-width:1200px; margin:0 auto; padding: 0 24px; }
section { border-bottom: 2px solid #000; }
.hero { padding: 80px 0; }
.kicker { font-family: ui-monospace, monospace; text-transform:uppercase; letter-spacing:0.3em; font-size:12px; margin-bottom: 24px; }
.display { font-size: clamp(48px, 9vw, 112px); line-height: 0.92; margin: 0 0 24px; }
.lead { font-size: clamp(18px, 2.4vw, 28px); max-width: 900px; line-height: 1.25; }
.btn { display:inline-block; background:#000; color:#FFFCEC; padding:18px 32px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em; border:2px solid #000; box-shadow: 6px 6px 0 0 #000; cursor:pointer; }
.row { display:flex; gap: 24px; flex-wrap: wrap; align-items:center; margin-top:32px; }
.tag { font-weight:900; text-transform: uppercase; letter-spacing: 0.2em; font-size: 14px; }
.h2 { font-size: clamp(32px, 6vw, 80px); margin: 0 0 32px; }
.bg-white { background:#fff; }
.bg-red { background:#FF3333; color:#FFFCEC; }
.bg-black { background:#000; color:#FFFCEC; }
.grid { display:grid; gap: 0; border:2px solid currentColor; }
.grid > * { border:2px solid currentColor; margin:-1px; padding:24px; }
.grid-2 { grid-template-columns: 1fr; }
.grid-3 { grid-template-columns: 1fr; }
@media (min-width:700px){ .grid-2 { grid-template-columns: 1fr 1fr; } .grid-3 { grid-template-columns: 1fr 1fr 1fr; } }
.num { background:#000; color:#FFFCEC; font-family: ui-monospace, monospace; padding: 4px 8px; font-size: 14px; margin-right:10px; }
.bg-red .grid { border-color:#FFFCEC; } .bg-red .grid > * { border-color:#FFFCEC; }
.bg-black .grid { border-color:#FFFCEC; } .bg-black .grid > * { border-color:#FFFCEC; }
.stat { font-size: clamp(40px, 6vw, 64px); font-family: 'Cabinet Grotesk', sans-serif; }
.testimonial { background:#FFFCEC; color:#000; padding:24px; border:2px solid #FFFCEC; box-shadow: 8px 8px 0 0 #FFFCEC; }
.pricing { background:#fff; border:2px solid #000; box-shadow: 8px 8px 0 0 #000; padding: 40px; max-width:680px; margin: 80px auto; }
.price { font-size: 80px; font-weight:900; line-height:1; font-family:'Cabinet Grotesk',sans-serif; }
.pricing ul { list-style:none; padding:0; margin: 24px 0; }
.pricing li { font-size: 18px; padding: 6px 0; }
.btn-block { display:block; width:100%; text-align:center; padding: 18px; background:#000; color:#FFFCEC; border:0; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; cursor:pointer; }
.final { padding: 96px 24px; background:#000; color:#FFFCEC; text-align:center; }
.final .accent { color:#FF3333; }
.btn-final { background:#FFFCEC; color:#000; padding: 22px 40px; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; border:2px solid #FFFCEC; cursor:pointer; font-size:20px; }
`;

function boldHtml(c, product) {
  return `
  <section class="hero bg-cream">
    <div class="container">
      <div class="kicker">// ${escape(product.name)}</div>
      <h1 class="display">${escape(c.headline)}</h1>
      <p class="lead">${escape(c.subheadline)}</p>
      <div class="row"><button class="btn">${escape(c.cta?.primary || "Get started")}</button><span class="tag">${escape(c.cta?.secondary || "")}</span></div>
    </div>
  </section>
  <section class="bg-white">
    <div class="container" style="padding:64px 24px;">
      <div class="kicker">// the deal</div>
      <div style="font-size:20px; line-height:1.6;">${paragraphs(c.description)}</div>
    </div>
  </section>
  <section class="bg-red">
    <div class="container" style="padding:80px 24px;">
      <h2 class="h2">Why bother?</h2>
      <div class="grid grid-3">
        ${(c.benefits || [])
          .map((b, i) => `<div><div class="kicker">/ ${String(i + 1).padStart(2, "0")}</div><h3>${escape(b.title)}</h3><p>${escape(b.description)}</p></div>`)
          .join("")}
      </div>
    </div>
  </section>
  <section class="bg-white">
    <div class="container" style="padding:80px 24px;">
      <h2 class="h2">What you get.</h2>
      <div class="grid grid-2">
        ${(c.features || [])
          .map((f, i) => `<div><h3><span class="num">${String(i + 1).padStart(2, "0")}</span>${escape(f.title)}</h3><p>${escape(f.description)}</p></div>`)
          .join("")}
      </div>
    </div>
  </section>
  <section class="bg-black">
    <div class="container" style="padding:80px 24px;">
      <div class="grid grid-3" style="margin-bottom:56px;">
        ${(c.socialProof?.stats || []).map((s) => `<div style="text-align:center;"><div class="stat">${escape(s.value)}</div><div class="kicker">${escape(s.label)}</div></div>`).join("")}
      </div>
      <div class="grid grid-2" style="border:0;">
        ${(c.socialProof?.testimonials || []).map((t) => `<blockquote class="testimonial" style="margin:0;"><p style="font-size:22px;font-weight:700;line-height:1.3;">"${escape(t.quote)}"</p><footer class="tag">${escape(t.name)} — ${escape(t.role)}</footer></blockquote>`).join("")}
      </div>
    </div>
  </section>
  <section class="bg-cream">
    <div class="container">
      <div class="pricing">
        <div class="kicker">// ${escape(c.pricing?.headline || "")}</div>
        <div class="price">${escape(c.pricing?.price || "")}</div>
        <div class="tag">${escape(c.pricing?.billing || "")}</div>
        <ul>${(c.pricing?.includes || []).map((i) => `<li>[✓] ${escape(i)}</li>`).join("")}</ul>
        <button class="btn-block">${escape(c.cta?.primary || "Get started")}</button>
        <p class="tag" style="text-align:center;margin-top:16px;">${escape(c.pricing?.guarantee || "")}</p>
      </div>
    </div>
  </section>
  <section class="final">
    <div class="kicker accent">// ${escape(c.cta?.urgency || "")}</div>
    <h2 class="display" style="margin:0 0 32px;">${escape(c.headline)}</h2>
    <button class="btn-final">${escape(c.cta?.primary || "Get started")} →</button>
  </section>
  `;
}

const STYLES_MIN = `
* { box-sizing: border-box; }
body { margin:0; background:#FBFAF7; color:#0a0a0a; font-family:'Work Sans', system-ui, sans-serif; }
h1, h2, h3 { font-family:'Cormorant Garamond', serif; font-weight:600; font-style: italic; letter-spacing:-0.01em; margin:0; }
.container { max-width: 980px; margin: 0 auto; padding: 0 24px; }
.narrow { max-width: 760px; margin: 0 auto; padding: 0 24px; }
.center { text-align:center; }
.kicker { text-transform: uppercase; letter-spacing: 0.3em; font-size: 12px; color:#737373; }
.divider { width: 48px; height: 1px; background:#a3a3a3; margin: 32px auto; }
section { border-top: 1px solid #e5e5e5; }
.hero { padding: 96px 0 128px; }
.display { font-size: clamp(40px, 7vw, 80px); line-height: 1.05; margin-bottom: 32px; }
.lead { font-size: 20px; color:#3f3f46; max-width: 680px; margin: 0 auto; line-height: 1.7; }
.story { padding: 128px 0; }
.story p { font-size: 18px; line-height: 1.9; margin: 0 0 24px; }
.story p:first-of-type::first-letter { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 60px; float: left; margin-right: 12px; line-height: 1; }
.benefits { padding: 128px 0; }
.benefits .grid { display:grid; gap: 64px 48px; grid-template-columns: 1fr; }
@media(min-width:700px){ .benefits .grid { grid-template-columns: 1fr 1fr; } }
.benefits h3 { font-size: 28px; margin: 8px 0 12px; }
.benefits p { color:#3f3f46; line-height:1.7; margin:0; }
.features { padding: 128px 0; }
.features ul { list-style:none; margin:0; padding:0; border-top:1px solid #e5e5e5; }
.features li { display:grid; grid-template-columns: 80px 1fr; gap:24px; padding: 28px 0; border-bottom:1px solid #e5e5e5; }
.features h3 { font-size: 24px; margin: 0 0 4px; }
.features p { color:#3f3f46; line-height:1.7; margin:0; }
.proof { background:#F4F1EA; padding: 128px 0; }
.proof .stats { display:grid; grid-template-columns: 1fr; gap: 32px; text-align:center; margin-bottom: 64px; }
@media(min-width:700px){ .proof .stats { grid-template-columns: 1fr 1fr 1fr; } }
.proof .stat { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 48px; }
.proof blockquote { text-align:center; max-width: 600px; margin: 0 auto 48px; }
.proof blockquote p { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 28px; line-height: 1.3; margin: 0 0 16px; }
.pricing { padding: 128px 0; text-align:center; }
.pricing .price { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 80px; margin: 8px 0 4px; }
.pricing .billing { color:#737373; margin-bottom: 32px; }
.pricing ul { list-style:none; padding:0; display:inline-block; text-align:left; margin: 16px 0 32px; }
.pricing li { color:#3f3f46; padding: 6px 0; }
.btn { background:#0a0a0a; color:#FBFAF7; border:0; padding: 16px 40px; text-transform: uppercase; letter-spacing: 0.3em; font-size: 12px; cursor:pointer; }
.final { padding: 128px 0; text-align:center; }
.final h2 { font-size: clamp(32px, 5vw, 56px); margin-bottom: 32px; }
`;

function minimalHtml(c, product) {
  return `
  <header class="container" style="display:flex;justify-content:space-between;align-items:center;padding:40px 24px 16px;">
    <div class="kicker">${escape(product.name)}</div>
    <button class="btn">${escape(c.cta?.primary || "Get started")}</button>
  </header>
  <section class="hero">
    <div class="narrow center">
      <div class="kicker">— Issue 01 —</div>
      <div class="divider"></div>
      <h1 class="display">${escape(c.headline)}</h1>
      <div class="divider"></div>
      <p class="lead">${escape(c.subheadline)}</p>
    </div>
  </section>
  <section class="story">
    <div class="narrow">
      <div class="kicker center" style="margin-bottom:48px;">The Story</div>
      ${paragraphs(c.description)}
    </div>
  </section>
  <section class="benefits">
    <div class="container">
      <div class="kicker center" style="margin-bottom:80px;">What it offers</div>
      <div class="grid">
        ${(c.benefits || []).map((b, i) => `<div><div class="kicker">${String(i + 1).padStart(2, "0")} ·</div><h3>${escape(b.title)}</h3><p>${escape(b.description)}</p></div>`).join("")}
      </div>
    </div>
  </section>
  <section class="features">
    <div class="container">
      <div class="kicker center" style="margin-bottom:80px;">Capabilities</div>
      <ul>${(c.features || []).map((f, i) => `<li><div class="kicker" style="padding-top:6px;">/ ${String(i + 1).padStart(2, "0")}</div><div><h3>${escape(f.title)}</h3><p>${escape(f.description)}</p></div></li>`).join("")}</ul>
    </div>
  </section>
  <section class="proof">
    <div class="container">
      <div class="kicker center" style="margin-bottom:64px;">In their words</div>
      <div class="stats">${(c.socialProof?.stats || []).map((s) => `<div><div class="stat">${escape(s.value)}</div><div class="kicker">${escape(s.label)}</div></div>`).join("")}</div>
      ${(c.socialProof?.testimonials || []).map((t) => `<blockquote><p>"${escape(t.quote)}"</p><div class="kicker">${escape(t.name)} — ${escape(t.role)}</div></blockquote>`).join("")}
    </div>
  </section>
  <section class="pricing">
    <div class="narrow">
      <div class="kicker">${escape(c.pricing?.headline || "")}</div>
      <div class="price">${escape(c.pricing?.price || "")}</div>
      <div class="billing">${escape(c.pricing?.billing || "")}</div>
      <ul>${(c.pricing?.includes || []).map((i) => `<li>— ${escape(i)}</li>`).join("")}</ul>
      <div><button class="btn">${escape(c.cta?.primary || "Get started")}</button></div>
      <p class="kicker" style="margin-top:24px;">${escape(c.pricing?.guarantee || "")}</p>
    </div>
  </section>
  <section class="final">
    <div class="narrow">
      <div class="kicker">— ${escape(c.cta?.urgency || "")} —</div>
      <h2 style="margin:24px 0 32px;">${escape(c.headline)}</h2>
      <button class="btn">${escape(c.cta?.primary || "Get started")}</button>
    </div>
  </section>
  `;
}

function buildHtml({ template, product, content }) {
  let body, styles, fonts;
  if (template === "bold") {
    body = boldHtml(content, product);
    styles = STYLES_BOLD;
    fonts =
      "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&f[]=satoshi@500,700&display=swap";
  } else if (template === "minimal") {
    body = minimalHtml(content, product);
    styles = STYLES_MIN;
    fonts =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Work+Sans:wght@400;500&display=swap";
  } else {
    body = modernHtml(content, product);
    styles = STYLES;
    fonts =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:wght@400;500;600&display=swap";
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escape(product.name)} — ${escape(content.headline || "Sales page")}</title>
<link rel="stylesheet" href="${fonts}" />
<style>${styles}</style>
</head>
<body class="bg-cream">${body}</body>
</html>`;
}

export function downloadStandaloneHtml({ template, product, content }) {
  const html = buildHtml({ template, product, content });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slug = (product.name || "sales-page").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  a.download = `${slug || "sales-page"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
