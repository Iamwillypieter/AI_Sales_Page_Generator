export default function TemplateBold({ product, content }) {
  const c = content;
  return (
    <div className="tmpl-bold bg-[#FFFCEC] text-black" data-testid="tmpl-bold">
      {/* Hero */}
      <section className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] mb-6">
            // {product.name}
          </div>
          <h1 className="h-display text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.92] mb-6">
            {c.headline}
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl leading-snug">{c.subheadline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-black text-[#FFFCEC] px-8 py-4 text-lg font-black uppercase tracking-wider border-2 border-black brutal-shadow hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-transform">
              {c.cta?.primary || "Get started"}
            </button>
            <div className="flex items-center text-sm uppercase tracking-widest font-bold">
              {c.cta?.secondary}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] mb-4">// the deal</div>
          {String(c.description || "")
            .split(/\n\n+/)
            .map((p, i) => (
              <p key={i} className="text-lg lg:text-xl leading-relaxed mb-4 max-w-3xl">
                {p}
              </p>
            ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b-2 border-black bg-[#FF3333] text-[#FFFCEC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <h2 className="h-display text-4xl sm:text-6xl font-black mb-10">Why bother?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-[#FFFCEC]">
            {(c.benefits || []).map((b, i) => (
              <div
                key={i}
                className="border-2 border-[#FFFCEC] -m-px p-6 hover:bg-[#FFFCEC] hover:text-[#FF3333] transition-colors"
              >
                <div className="font-mono text-xs uppercase tracking-[0.2em] mb-3">
                  / {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="h-display text-2xl font-black mb-3">{b.title}</h3>
                <p className="leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <h2 className="h-display text-4xl sm:text-6xl font-black mb-10">What you get.</h2>
          <div className="grid sm:grid-cols-2 gap-0 border-2 border-black">
            {(c.features || []).map((f, i) => (
              <div key={i} className="border-2 border-black -m-px p-6">
                <h3 className="h-display text-xl font-black mb-2 flex items-center gap-3">
                  <span className="bg-black text-[#FFFCEC] px-2 py-1 font-mono text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.title}
                </h3>
                <p className="text-base leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-b-2 border-black bg-black text-[#FFFCEC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          {c.socialProof?.stats?.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-6 mb-14 border-2 border-[#FFFCEC]">
              {c.socialProof.stats.map((s, i) => (
                <div key={i} className="border-2 border-[#FFFCEC] -m-px p-8 text-center">
                  <div className="h-display text-5xl lg:text-6xl font-black text-[#FFFCEC]">{s.value}</div>
                  <div className="text-xs uppercase tracking-[0.25em] mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            {(c.socialProof?.testimonials || []).map((t, i) => (
              <blockquote
                key={i}
                className="border-2 border-[#FFFCEC] bg-[#FFFCEC] text-black p-6 brutal-shadow"
                style={{ boxShadow: "8px 8px 0 0 #FFFCEC" }}
              >
                <p className="h-display text-xl lg:text-2xl font-bold leading-snug mb-4">"{t.quote}"</p>
                <footer className="text-sm uppercase tracking-widest font-bold">
                  {t.name} — {t.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b-2 border-black bg-[#FFFCEC]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
          <div className="border-2 border-black bg-white brutal-shadow p-8 lg:p-10">
            <div className="font-mono text-xs uppercase tracking-[0.3em] mb-3">
              // {c.pricing?.headline}
            </div>
            <div className="h-display text-7xl font-black leading-none">{c.pricing?.price}</div>
            <div className="text-sm uppercase tracking-widest mb-6">{c.pricing?.billing}</div>
            <ul className="space-y-2 mb-8">
              {(c.pricing?.includes || []).map((it, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs">[✓]</span>
                  <span className="text-lg">{it}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-black text-[#FFFCEC] py-4 font-black uppercase tracking-widest text-lg hover:bg-[#FF3333]">
              {c.cta?.primary || "Get started"}
            </button>
            {c.pricing?.guarantee && (
              <p className="text-xs uppercase tracking-widest mt-4 text-center">
                {c.pricing.guarantee}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-[#FFFCEC] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3333] mb-4">
            // {c.cta?.urgency}
          </div>
          <h2 className="h-display text-5xl sm:text-7xl font-black mb-8">{c.headline}</h2>
          <button className="bg-[#FFFCEC] text-black px-10 py-5 text-xl font-black uppercase tracking-wider border-2 border-[#FFFCEC] hover:bg-[#FF3333] hover:text-[#FFFCEC]">
            {c.cta?.primary || "Get started"} →
          </button>
        </div>
      </section>
    </div>
  );
}
