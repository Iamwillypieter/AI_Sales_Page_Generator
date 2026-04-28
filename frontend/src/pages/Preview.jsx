import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatApiErrorDetail } from "../lib/api";
import TemplateRenderer from "../components/templates/TemplateRenderer";
import { downloadStandaloneHtml } from "../lib/exportHtml";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function Preview() {
  const { id } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/pages/${id}`);
        setPage(data);
      } catch (e) {
        toast.error(formatApiErrorDetail(e.response?.data?.detail) || e.message);
      }
    })();
  }, [id]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
        Loading<span className="terminal-cursor"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-neutral-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-30">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 hover:text-black"
          data-testid="preview-back-btn"
        >
          <ArrowLeft size={12} /> Dashboard
        </Link>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">
          // live preview · {page.template}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/page/${page.id}`}
            className="flex items-center gap-1.5 border border-neutral-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:border-black"
            data-testid="preview-edit-btn"
          >
            <Pencil size={12} /> Edit
          </Link>
          <button
            onClick={() =>
              downloadStandaloneHtml({
                product: page.product,
                template: page.template,
                content: page.content,
              })
            }
            className="flex items-center gap-1.5 bg-black text-white px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#002FA7]"
            data-testid="preview-export-btn"
          >
            <Download size={12} /> Export HTML
          </button>
        </div>
      </div>
      <TemplateRenderer template={page.template} product={page.product} content={page.content} />
    </div>
  );
}
