import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import TemplateEditor from "../components/TemplateEditor";
import { serviceById } from "../config/business";
import { BASE_URL, VIRAL_TEMPLATES_URL } from "../constants";

const service = serviceById("templates");
const RATE_LIMIT = "Thodi der baad try karein";

function requestError(error, fallback) {
  if (error?.response?.status === 429) return RATE_LIMIT;
  if (!error?.response) return "Could not reach the server. Check your connection and try again.";
  return fallback;
}

function previewUrl(path) {
  if (typeof path !== "string" || !path.trim()) return "";
  try {
    const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
    return new URL(path.trim(), base).href;
  } catch {
    return "";
  }
}

function aspectOf(template) {
  const width = Number(template?.width);
  const height = Number(template?.height);
  if (width > 0 && height > 0) return `${width} / ${height}`;
  return "9 / 16";
}

export default function ViralTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const closeEditor = useCallback(() => setSelected(null), []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(VIRAL_TEMPLATES_URL);
        if (cancel) return;
        const list = Array.isArray(response.data?.templates) ? response.data.templates : [];
        setTemplates(list);
      } catch (err) {
        if (cancel) return;
        setTemplates([]);
        setError(requestError(err, "Could not load templates."));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const categories = useMemo(() => {
    const seen = new Set();
    const names = [];
    for (const item of templates) {
      const name = typeof item?.category === "string" ? item.category.trim() : "";
      if (!name || seen.has(name)) continue;
      seen.add(name);
      names.push(name);
    }
    return names;
  }, [templates]);

  const visible = category === "all"
    ? templates
    : templates.filter((item) => item?.category === category);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <PageHeader title={service.name} backTo="/ai-magic" backLabel="Back to AI Magic" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-primaryPurple">Free tool</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{service.name}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500 sm:text-base">
            Pick a template, add your photo, and generate an image you can share or download.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
            {["all", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={category === item
                  ? "rounded-full bg-primaryPurple px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                  : "rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple"}
              >
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div
            role="status"
            className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-gridBorder bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
            <p className="font-bold text-gray-800">Loading templates...</p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600"
          >
            <AlertCircle className="mt-0.5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
            No templates yet.
          </div>
        )}

        {!loading && !error && templates.length > 0 && (
          <div className="mt-8">
            {visible.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
                No templates in this category.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {visible.map((template) => {
                  const preview = previewUrl(template.preview_url);
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelected(template)}
                      className="overflow-hidden rounded-[2rem] border border-gridBorder bg-white text-left shadow-sm"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt=""
                          loading="lazy"
                          className="w-full bg-purple-50 object-cover"
                          style={{ aspectRatio: aspectOf(template) }}
                        />
                      ) : (
                        <span className="block w-full bg-purple-50" style={{ aspectRatio: aspectOf(template) }} />
                      )}
                      <span className="block px-3 py-3">
                        <span className="block truncate text-sm font-black text-gray-900">
                          {template.name || "Template"}
                        </span>
                        {template.category && (
                          <span className="mt-1 block truncate text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {template.category}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
      {selected && (
        <TemplateEditor key={selected.id} template={selected} onClose={closeEditor} />
      )}
      <SiteFooter />
    </div>
  );
}
