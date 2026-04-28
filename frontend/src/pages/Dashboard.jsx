import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, formatApiErrorDetail } from "../lib/api";
import AppShell from "../components/AppShell";
import { Plus, Trash2, Pencil, Eye, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const TEMPLATE_LABEL = {
  modern: "Modern Glass",
  bold: "Brutalist Bold",
  minimal: "Editorial Minimal",
};

export default function Dashboard() {
  const [pages, setPages] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get("/pages");
      setPages(data);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
      setPages([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this sales page? This cannot be undone.")) return;
    try {
      await api.delete(`/pages/${id}`);
      setPages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Page deleted");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
    }
  };

  return (
    <AppShell>
      <div className="px-6 lg:px-12 py-10 lg:py-14 max-w-7xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
              // your library
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              Sales pages.
            </h1>
            <p className="text-neutral-600 mt-3 max-w-lg">
              Every page you generate lives here. Edit, regenerate, preview, or export anytime.
            </p>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-black text-white px-5 py-3 font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#002FA7] transition-colors brutal-shadow-sm"
            data-testid="dashboard-new-page-btn"
          >
            <Plus size={14} /> New page
          </Link>
        </div>

        {pages === null && (
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
            Loading<span className="terminal-cursor"></span>
          </div>
        )}

        {pages && pages.length === 0 && (
          <div
            className="border border-neutral-200 p-12 text-center bg-[#F9F9F9]"
            data-testid="empty-state"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
              // nothing here yet
            </div>
            <h2 className="font-display text-3xl font-black mb-3">A blank canvas.</h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-6">
              Drop in a product or service and we'll draft a structured, persuasive landing page in
              about a minute.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 font-bold uppercase tracking-[0.15em] text-xs"
              data-testid="empty-state-cta"
            >
              <Plus size={14} /> Create your first page
            </Link>
          </div>
        )}

        {pages && pages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" data-testid="pages-grid">
            {pages.map((p) => (
              <article
                key={p.id}
                className="group border border-neutral-200 bg-white p-6 hover:-translate-y-1 hover:shadow-lg hover:border-black transition-all duration-200"
                data-testid={`page-card-${p.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] bg-black text-white px-2 py-1">
                    {TEMPLATE_LABEL[p.template] || p.template}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-display text-xl font-black leading-tight mb-2 line-clamp-2">
                  {p.content?.headline || p.product?.name}
                </h3>
                <p className="text-sm text-neutral-600 line-clamp-3 mb-5">
                  {p.content?.subheadline || p.product?.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/page/${p.id}`)}
                    className="flex items-center gap-1.5 border border-black px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors"
                    data-testid={`edit-btn-${p.id}`}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => navigate(`/page/${p.id}/preview`)}
                    className="flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:border-black transition-colors"
                    data-testid={`preview-btn-${p.id}`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="ml-auto text-[#FF3333] hover:bg-[#FF3333] hover:text-white p-2 transition-colors"
                    aria-label="Delete"
                    data-testid={`delete-btn-${p.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <Link
                  to={`/page/${p.id}/preview`}
                  className="mt-4 flex items-center gap-1 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 group-hover:text-black"
                >
                  Open <ArrowUpRight size={12} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
