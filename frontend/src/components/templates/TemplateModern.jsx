import { Check, Star } from "lucide-react";

export default function TemplateModern({ product, content }) {
  const c = content;
  return (
    <div className="tmpl-modern bg-white text-neutral-900" data-testid="tmpl-modern">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at top, #DBEAFE 0%, transparent 50%), radial-gradient(ellipse at bottom right, #E0E7FF 0%, transparent 60%), #ffffff",
          }}
        />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-neutral-200 rounded-full px-4 py-1.5 text-xs font-medium text-neutral-700 mb-6 shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {product.name}
          </div>
          <h1 className="h-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5">
            {c.headline}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {c.subheadline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button className="bg-neutral-900 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-lg hover:bg-neutral-800 transition-colors">
              {c.cta?.primary || "Get started"}
            </button>
            <span className="text-sm text-neutral-500">{c.cta?.secondary}</span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <Paragraphs text={c.description} className="text-lg text-neutral-700 leading-relaxed" />
      </section>

      {/* Benefits */}
      <section className="bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2 className="h-display text-3xl sm:text-4xl font-bold text-center mb-12">Why teams switch</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(c.benefits || []).map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <Check size={18} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <h2 className="h-display text-3xl sm:text-4xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {(c.features || []).map((f, i) => (
            <div key={i} className="rounded-2xl p-6 border border-neutral-200 bg-white">
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {c.socialProof?.stats?.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {c.socialProof.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="h-display text-4xl font-extrabold text-blue-700">{s.value}</div>
                  <div className="text-sm text-neutral-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(c.socialProof?.testimonials || []).map((t, i) => (
              <blockquote key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex gap-1 mb-3 text-amber-400">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <Star key={n} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-800 leading-relaxed mb-4">"{t.quote}"</p>
                <footer className="text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-neutral-500"> · {t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-20 text-center">
        <h2 className="h-display text-3xl sm:text-4xl font-bold mb-4">{c.pricing?.headline}</h2>
        <div className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
          <div className="h-display text-5xl font-extrabold mb-1">{c.pricing?.price}</div>
          <div className="text-sm text-neutral-500 mb-6">{c.pricing?.billing}</div>
          <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
            {(c.pricing?.includes || []).map((it, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check size={16} className="mt-1 text-blue-700" /> <span>{it}</span>
              </li>
            ))}
          </ul>
          <button className="bg-neutral-900 text-white px-8 py-3.5 rounded-2xl font-semibold w-full hover:bg-neutral-800">
            {c.cta?.primary || "Get started"}
          </button>
          {c.pricing?.guarantee && (
            <div className="text-xs text-neutral-500 mt-4">{c.pricing.guarantee}</div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-blue-300 mb-3">{c.cta?.urgency}</div>
          <h2 className="h-display text-3xl sm:text-4xl font-bold mb-6">{c.headline}</h2>
          <button className="bg-white text-neutral-900 px-8 py-4 rounded-2xl font-semibold">
            {c.cta?.primary || "Get started"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Paragraphs({ text, className }) {
  if (!text) return null;
  const parts = String(text).split(/\n\n+/);
  return (
    <div className="space-y-4">
      {parts.map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </div>
  );
}
