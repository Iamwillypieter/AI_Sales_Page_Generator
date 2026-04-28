import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, formatApiErrorDetail } from "../lib/api";
import AppShell from "../components/AppShell";
import TemplateRenderer from "../components/templates/TemplateRenderer";
import { downloadStandaloneHtml } from "../lib/exportHtml";
import { ArrowLeft, Sparkles, RefreshCw, Download, Eye, Save } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  "Reading the brief",
  "Drafting the headline",
  "Distilling benefits",
  "Sequencing features",
  "Writing the call to action",
  "Polishing copy",
];

const TEMPLATES = [
  { id: "modern", name: "Modern Glass", desc: "Soft, rounded, gradient hero." },
  { id: "bold", name: "Brutalist Bold", desc: "Massive type, hard borders." },
  { id: "minimal", name: "Editorial Minimal", desc: "Whitespace, serif, restraint." },
];

const SECTIONS = [
  { id: "headline", label: "Headline" },
  { id: "subheadline", label: "Sub-headline" },
  { id: "description", label: "Description" },
  { id: "benefits", label: "Benefits" },
  { id: "features", label: "Features" },
  { id: "socialProof", label: "Social Proof" },
  { id: "pricing", label: "Pricing" },
  { id: "cta", label: "CTA" },
];

const blankProduct = {
  name: "",
  description: "",
  features: [],
  target_audience: "",
  price: "",
  usp: "",
  template: "modern",
};

export default function Generator() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState(blankProduct);
  const [featureInput, setFeatureInput] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [savingSection, setSavingSection] = useState(null);
  const [pageId, setPageId] = useState(id || null);
  const stepTimer = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/pages/${id}`);
        setProduct({ ...data.product, template: data.template });
        setContent(data.content);
        setPageId(data.id);
      } catch (e) {
        toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
      }
    })();
  }, [id, isEdit]);

  const startStepLoop = () => {
    setStepIdx(0);
    stepTimer.current = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
    }, 1500);
  };
  const stopStepLoop = () => {
    if (stepTimer.current) clearInterval(stepTimer.current);
    stepTimer.current = null;
  };

  useEffect(() => () => stopStepLoop(), []);

  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    // Allow comma-separated
    const items = v.split(",").map((s) => s.trim()).filter(Boolean);
    setProduct((p) => ({ ...p, features: [...p.features, ...items] }));
    setFeatureInput("");
  };

  const removeFeature = (idx) => {
    setProduct((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));
  };

  const generate = async () => {
    if (!product.name.trim() || !product.description.trim()) {
      toast.error("Product name and description are required");
      return;
    }
    setLoading(true);
    startStepLoop();
    try {
      const { data } = await api.post("/pages/generate", product);
      setContent(data.content);
      setPageId(data.id);
      toast.success("Sales page generated");
      if (!isEdit) navigate(`/page/${data.id}`, { replace: true });
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally {
      stopStepLoop();
      setLoading(false);
    }
  };

  const regenerateAll = async () => {
    if (!pageId) return;
    setLoading(true);
    startStepLoop();
    try {
      const { data } = await api.post(`/pages/${pageId}/regenerate`);
      setContent(data.content);
      toast.success("Regenerated");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally {
      stopStepLoop();
      setLoading(false);
    }
  };

  const regenerateSection = async (section) => {
    if (!pageId) return;
    setSavingSection(section);
    try {
      const { data } = await api.post(`/pages/${pageId}/regenerate-section`, { section });
      setContent(data.content);
      toast.success(`Updated ${section}`);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    } finally {
      setSavingSection(null);
    }
  };

  const saveProduct = async () => {
    if (!pageId) return;
    try {
      const { data } = await api.put(`/pages/${pageId}`, {
        product,
        template: product.template,
      });
      setContent(data.content);
      toast.success("Saved");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    }
  };

  const exportHtml = () => {
    if (!content) return;
    downloadStandaloneHtml({ product, template: product.template, content });
  };

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-1px)]">
        {/* LEFT: form */}
        <section className="lg:col-span-5 xl:col-span-4 border-r border-neutral-200 p-6 lg:p-10 overflow-y-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 hover:text-black mb-6"
            data-testid="back-to-dashboard"
          >
            <ArrowLeft size={12} /> Dashboard
          </Link>

          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
            // {isEdit ? "edit page" : "new page"}
          </div>
          <h1 className="font-display text-3xl font-black mb-6">
            {isEdit ? "Refine the brief." : "Tell us about it."}
          </h1>

          <FieldLabel num="01">Product / service name</FieldLabel>
          <input
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="e.g. PixelDraft Pro"
            className="w-full border border-neutral-300 px-3 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="form-name-input"
          />

          <FieldLabel num="02">Description</FieldLabel>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={4}
            placeholder="What does it do? What problem does it solve?"
            className="w-full border border-neutral-300 px-3 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black resize-y"
            data-testid="form-description-input"
          />

          <FieldLabel num="03">Key features</FieldLabel>
          <div className="flex gap-2 mb-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Type a feature, press Enter (or paste comma-separated)"
              className="flex-1 border border-neutral-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              data-testid="form-feature-input"
            />
            <button
              type="button"
              onClick={addFeature}
              className="border border-black px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white"
              data-testid="form-feature-add-btn"
            >
              Add
            </button>
          </div>
          {product.features.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-5" data-testid="form-feature-list">
              {product.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 border border-neutral-300 bg-[#F9F9F9] px-3 py-1.5 text-sm"
                >
                  {f}
                  <button
                    onClick={() => removeFeature(i)}
                    className="text-neutral-400 hover:text-[#FF3333]"
                    aria-label={`Remove ${f}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <FieldLabel num="04">Target audience</FieldLabel>
          <input
            value={product.target_audience}
            onChange={(e) => setProduct({ ...product, target_audience: e.target.value })}
            placeholder="e.g. Solo founders shipping their first SaaS"
            className="w-full border border-neutral-300 px-3 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="form-audience-input"
          />

          <FieldLabel num="05">Price</FieldLabel>
          <input
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="e.g. $49 / month"
            className="w-full border border-neutral-300 px-3 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="form-price-input"
          />

          <FieldLabel num="06">Unique selling points</FieldLabel>
          <textarea
            value={product.usp}
            onChange={(e) => setProduct({ ...product, usp: e.target.value })}
            rows={3}
            placeholder="What makes you different? Why should anyone care?"
            className="w-full border border-neutral-300 px-3 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black resize-y"
            data-testid="form-usp-input"
          />

          <FieldLabel num="07">Template</FieldLabel>
          <div className="grid grid-cols-3 gap-2 mb-6" data-testid="form-template-picker">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setProduct({ ...product, template: t.id })}
                className={`text-left p-3 border transition-all ${
                  product.template === t.id
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:border-black"
                }`}
                data-testid={`template-${t.id}`}
              >
                <div className="font-bold text-sm leading-tight">{t.name}</div>
                <div
                  className={`text-[11px] mt-1 ${
                    product.template === t.id ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  {t.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {!isEdit && (
              <button
                onClick={generate}
                disabled={loading}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 hover:bg-[#002FA7] transition-colors disabled:opacity-60"
                data-testid="generate-btn"
              >
                <Sparkles size={16} /> {loading ? "Generating…" : "Generate sales page"}
              </button>
            )}
            {isEdit && (
              <>
                <button
                  onClick={saveProduct}
                  className="w-full border border-black py-3 font-bold uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
                  data-testid="save-product-btn"
                >
                  <Save size={14} /> Save brief &amp; template
                </button>
                <button
                  onClick={regenerateAll}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 hover:bg-[#002FA7] transition-colors disabled:opacity-60"
                  data-testid="regenerate-all-btn"
                >
                  <RefreshCw size={16} /> {loading ? "Regenerating…" : "Regenerate full page"}
                </button>
              </>
            )}
          </div>
        </section>

        {/* RIGHT: preview */}
        <section className="lg:col-span-7 xl:col-span-8 bg-[#F9F9F9] p-6 lg:p-8 overflow-y-auto">
          <div className="border border-neutral-300 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-3 font-mono text-[11px] text-neutral-500 truncate">
                  preview.salescraft.io/{pageId || "untitled"}
                </span>
              </div>
              {content && pageId && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/page/${pageId}/preview`}
                    className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] border border-neutral-300 px-2 py-1 hover:border-black"
                    data-testid="open-preview-btn"
                  >
                    <Eye size={12} /> Open
                  </Link>
                  <button
                    onClick={exportHtml}
                    className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] border border-neutral-300 px-2 py-1 hover:border-black"
                    data-testid="export-html-btn"
                  >
                    <Download size={12} /> Export HTML
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[60vh]">
              {loading && (
                <div className="scanline-bg p-8 lg:p-12 text-white" data-testid="generating-state">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#4F7BFF] mb-4">
                    // ai is drafting
                  </div>
                  <ul className="space-y-3 max-w-md font-mono text-sm">
                    {STEPS.map((s, i) => (
                      <li
                        key={s}
                        className={`flex items-center gap-3 ${
                          i < stepIdx ? "text-neutral-500 line-through" : ""
                        } ${i === stepIdx ? "text-white" : ""}`}
                      >
                        <span className={i <= stepIdx ? "text-[#10B981]" : "text-neutral-600"}>
                          {i < stepIdx ? "✓" : i === stepIdx ? "▶" : "·"}
                        </span>
                        <span className={i === stepIdx ? "terminal-cursor" : ""}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!loading && !content && (
                <div
                  className="dotted-grid-bg p-12 lg:p-20 text-center min-h-[60vh] flex flex-col items-center justify-center"
                  data-testid="preview-empty"
                >
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
                    // live preview
                  </div>
                  <h2 className="font-display text-3xl lg:text-4xl font-black mb-3 max-w-md">
                    Your sales page will materialize here.
                  </h2>
                  <p className="text-neutral-600 max-w-md">
                    Fill in the brief on the left and hit{" "}
                    <span className="font-mono bg-black text-white px-2 py-0.5 text-xs">
                      Generate
                    </span>
                    .
                  </p>
                </div>
              )}

              {!loading && content && (
                <TemplateRenderer
                  template={product.template}
                  product={product}
                  content={content}
                />
              )}
            </div>
          </div>

          {/* Section regenerator */}
          {isEdit && content && (
            <div className="mt-6 border border-neutral-200 bg-white p-5" data-testid="section-regen-panel">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
                // regenerate by section
              </div>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    disabled={savingSection !== null}
                    onClick={() => regenerateSection(s.id)}
                    className="flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    data-testid={`regen-section-${s.id}`}
                  >
                    <RefreshCw size={11} className={savingSection === s.id ? "animate-spin" : ""} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function FieldLabel({ children, num }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
      <span className="font-mono text-neutral-400 mr-2">{num}</span>
      {children}
    </label>
  );
}
