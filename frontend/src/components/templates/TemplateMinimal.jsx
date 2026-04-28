export default function TemplateMinimal({ product, content }) {
  const c = content;
  return (
    <div className="tmpl-minimal bg-[#FBFAF7] text-neutral-900" data-testid="tmpl-minimal">
      <header className="max-w-6xl mx-auto px-6 lg:px-12 pt-10 pb-4 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{product.name}</div>
        <button className="text-xs uppercase tracking-[0.25em] border border-neutral-400 px-4 py-2 hover:bg-neutral-900 hover:text-[#FBFAF7] hover:border-neutral-900 transition-colors">
          {c.cta?.primary || "Get started"}
        </button>
      </header>

      <section className="max-w-4xl mx-auto px-6 lg:px-12 pt-20 pb-32 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-10">— Issue 01 —</div>
        <h1 className="h-display italic text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-10">
          {c.headline}
        </h1>
        <div className="w-12 h-px bg-neutral-400 mx-auto mb-10" />
        <p className="text-lg lg:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          {c.subheadline}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-32 border-t border-neutral-200">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-10 text-center">
          The Story
        </div>
        {String(c.description || "")
          .split(/\n\n+/)
          .map((p, i) => (
            <p
              key={i}
              className={`text-lg leading-[1.9] mb-6 ${i === 0 ? "first-letter:h-display first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none" : ""}`}
            >
              {p}
            </p>
          ))}
      </section>

      <section className="border-t border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-32">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-12 text-center">
            What it offers
          </div>
          <div className="grid sm:grid-cols-2 gap-y-16 gap-x-12">
            {(c.benefits || []).map((b, i) => (
              <div key={i}>
                <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-3">
                  {String(i + 1).padStart(2, "0")} ·
                </div>
                <h3 className="h-display italic text-3xl mb-3">{b.title}</h3>
                <p className="text-neutral-700 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-12 text-center">
            Capabilities
          </div>
          <ul className="divide-y divide-neutral-200">
            {(c.features || []).map((f, i) => (
              <li key={i} className="grid grid-cols-12 gap-6 py-7">
                <div className="col-span-2 text-xs uppercase tracking-[0.3em] text-neutral-400 pt-2">
                  / {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-10">
                  <h3 className="h-display italic text-2xl mb-1">{f.title}</h3>
                  <p className="text-neutral-700 leading-relaxed">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#F4F1EA]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-12 text-center">
            In their words
          </div>
          {c.socialProof?.stats?.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-8 mb-16 text-center">
              {c.socialProof.stats.map((s, i) => (
                <div key={i}>
                  <div className="h-display italic text-5xl">{s.value}</div>
                  <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-12">
            {(c.socialProof?.testimonials || []).map((t, i) => (
              <blockquote key={i} className="text-center max-w-2xl mx-auto">
                <p className="h-display italic text-2xl lg:text-3xl leading-snug mb-4">
                  "{t.quote}"
                </p>
                <footer className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {t.name} — {t.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">
            {c.pricing?.headline}
          </div>
          <div className="h-display italic text-7xl mb-2">{c.pricing?.price}</div>
          <div className="text-sm text-neutral-500 mb-10">{c.pricing?.billing}</div>
          <ul className="space-y-3 mb-10 inline-block text-left">
            {(c.pricing?.includes || []).map((it, i) => (
              <li key={i} className="text-neutral-700">
                — {it}
              </li>
            ))}
          </ul>
          <div>
            <button className="bg-neutral-900 text-[#FBFAF7] px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-neutral-700">
              {c.cta?.primary || "Get started"}
            </button>
          </div>
          {c.pricing?.guarantee && (
            <p className="text-xs text-neutral-500 mt-6">{c.pricing.guarantee}</p>
          )}
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#FBFAF7]">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">
            — {c.cta?.urgency} —
          </div>
          <h2 className="h-display italic text-4xl lg:text-5xl mb-8">{c.headline}</h2>
          <button className="bg-neutral-900 text-[#FBFAF7] px-12 py-4 text-xs uppercase tracking-[0.3em] hover:bg-neutral-700">
            {c.cta?.primary || "Get started"}
          </button>
          <div className="text-sm text-neutral-500 mt-4">{c.cta?.secondary}</div>
        </div>
      </section>
    </div>
  );
}
