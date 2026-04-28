import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Sparkles, FileCode, RefreshCw } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? "/dashboard" : "/register";
  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b border-neutral-200 px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-black tracking-tight">
          SalesCraft<span className="text-[#002FA7]">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold uppercase tracking-[0.15em] hover:underline" data-testid="nav-login">
            Log in
          </Link>
          <Link
            to={ctaTo}
            className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#002FA7]"
            data-testid="nav-get-started"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="px-6 lg:px-12 pt-20 lg:pt-28 pb-20">
        <div className="max-w-5xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-6">
            // ai sales page generator · v1
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight">
            Brief in.
            <br />
            <span className="bg-black text-white px-3">Conversion-ready</span> page out.
          </h1>
          <p className="text-lg lg:text-xl text-neutral-600 max-w-2xl mt-8 leading-relaxed">
            Drop in a product description, target audience, and price. SalesCraft drafts a
            structured landing page — headline, benefits, social proof, pricing, CTA — in three
            distinct templates.
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <Link
              to={ctaTo}
              className="flex items-center gap-2 bg-black text-white px-7 py-4 font-bold uppercase tracking-[0.15em] text-sm hover:bg-[#002FA7] transition-colors brutal-shadow-sm"
              data-testid="hero-cta"
            >
              <Sparkles size={16} /> Generate your first page <ArrowRight size={14} />
            </Link>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
              ~ 60 seconds · no credit card
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#F9F9F9] px-6 lg:px-12 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          <Feature
            icon={<Sparkles size={18} />}
            kicker="01 / draft"
            title="Structured by default"
            body="Headlines, benefits, features, social proof, pricing, and CTAs — every section, every time."
          />
          <Feature
            icon={<FileCode size={18} />}
            kicker="02 / templates"
            title="Three real designs"
            body="Modern Glass, Brutalist Bold, Editorial Minimal. Switch styles without rewriting copy."
          />
          <Feature
            icon={<RefreshCw size={18} />}
            kicker="03 / iterate"
            title="Section-level regen"
            body="Don't like the headline? Regenerate just that section. Edit the brief, reroll the page."
          />
        </div>
      </section>

      <section className="border-t border-neutral-200 px-6 lg:px-12 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-black mb-6">
          Stop staring at a blank Figma file.
        </h2>
        <Link
          to={ctaTo}
          className="inline-flex items-center gap-2 bg-black text-white px-7 py-4 font-bold uppercase tracking-[0.15em] text-sm"
          data-testid="footer-cta"
        >
          Start drafting <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="border-t border-neutral-200 px-6 lg:px-12 py-6 text-xs font-mono text-neutral-500 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} SalesCraft. Made for shippers.
      </footer>
    </div>
  );
}

function Feature({ icon, kicker, title, body }) {
  return (
    <div className="bg-white border border-neutral-200 p-6 hover:-translate-y-1 hover:shadow-lg hover:border-black transition-all">
      <div className="w-10 h-10 border border-black flex items-center justify-center mb-4">{icon}</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-2">{kicker}</div>
      <h3 className="font-display text-xl font-black mb-2">{title}</h3>
      <p className="text-neutral-600 leading-relaxed">{body}</p>
    </div>
  );
}
