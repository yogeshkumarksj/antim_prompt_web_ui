import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertCircle, Clock, Copy } from "lucide-react";
import { Masonry, PhotoFrame, PhotoMeta } from "../components/PhotoFrame";
import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import { serviceById } from "../config/business";
import { ART_TRENDS_URL } from "../constants";
import { interpretAiError, interpretAiResponse, safeHttpUrl } from "../utils/aiFeature";

const service = serviceById("art");

function pretty(value) {
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeCategories(data) {
  const raw = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
      ? data.categories
      : Array.isArray(data?.items)
        ? data.items
        : [];
  const seen = new Set();
  const categories = [];
  for (const item of raw) {
    let entry = null;
    if (typeof item === "string" && item.trim()) {
      entry = { id: item.trim(), label: pretty(item.trim()) };
    } else if (item && typeof item === "object") {
      const id = item.id ?? item.slug ?? item.key ?? item.value ?? item.name;
      if (id != null && String(id).trim()) {
        entry = {
          id: String(id).trim(),
          label: String(item.label ?? item.name ?? item.title ?? pretty(id)),
        };
      }
    }
    if (!entry || entry.id.toLowerCase() === "all" || seen.has(entry.id)) continue;
    seen.add(entry.id);
    categories.push(entry);
  }
  const trendingIndex = categories.findIndex((item) => (
    item.id.toLowerCase() === "trending" || item.label.toLowerCase() === "trending"
  ));
  if (trendingIndex > 0) {
    const [trending] = categories.splice(trendingIndex, 1);
    categories.unshift(trending);
  }
  return categories;
}

function pickDefault(categories) {
  const trending = categories.find((item) => (
    item.id.toLowerCase() === "trending" || item.label.toLowerCase() === "trending"
  ));
  return trending?.id || categories[0]?.id || "trending";
}

function categoryLabel(value, categories) {
  if (value == null || value === "") return "";
  const text = String(value);
  const match = categories.find((item) => (
    item.id === text
    || item.label.toLowerCase() === text.toLowerCase()
    || item.id.toLowerCase() === text.toLowerCase()
  ));
  return match?.label || text;
}

function httpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  return safeHttpUrl(value.trim());
}

function readOk(response) {
  const judged = interpretAiResponse(response);
  if (judged.kind === "limit") return judged;
  const data = response?.data ?? {};
  if (
    data
    && typeof data === "object"
    && (
      Array.isArray(data)
      || Array.isArray(data.trends)
      || Array.isArray(data.categories)
      || Array.isArray(data.items)
      || data.status === "success"
    )
  ) {
    return { kind: "success", data };
  }
  return judged;
}

function LimitNote() {
  return (
    <div
      role="status"
      className="mx-auto mt-8 flex max-w-2xl gap-3 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6"
    >
      <Clock className="mt-0.5 shrink-0" />
      <div>
        <p className="text-lg font-black">Limit reached, try tomorrow.</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900">
          Today&apos;s allowance for this tool is used up. Come back tomorrow to run it again.
        </p>
      </div>
    </div>
  );
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600"
    >
      <AlertCircle className="mt-0.5 shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

function CopyBlock({ label, text, buttonLabel = "Copy" }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <div className="mt-4 rounded-2xl border border-gridBorder bg-promptBox p-4">
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700" style={{ whiteSpace: "pre-wrap" }}>{text}</p>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            setCopied(false);
          }
        }}
        className="mt-3 inline-flex items-center text-sm font-bold text-primaryPurple hover:underline"
      >
        <Copy size={16} className="mr-1" />
        {copied ? "Copied" : buttonLabel}
      </button>
    </div>
  );
}

function ArtVisual({ trend, onMetrics }) {
  const src = httpUrl(trend?.image_url);
  if (!src) {
    return (
      <div
        className="flex w-full items-end bg-gradient-to-r from-primaryPurple to-secondaryBlue p-5"
        style={{ aspectRatio: "4 / 5" }}
      >
        <span className="text-lg font-black text-white">{trend?.name || "Trend"}</span>
      </div>
    );
  }
  return (
    <PhotoFrame
      src={src}
      alt={trend?.name || ""}
      meta={trend}
      hideCaption
      onMetrics={onMetrics}
    />
  );
}

function TrendFooter({ meta, title, aside }) {
  return (
    <div className="p-3">
      {meta?.caption ? <PhotoMeta caption={meta.caption} orient={meta.orient} /> : null}
      <h3 className={`${meta?.caption ? "mt-2 " : ""}line-clamp-1 text-sm font-bold text-gray-800`}>{title}</h3>
      {aside ? <div className="mt-2 flex items-center justify-between">{aside}</div> : null}
    </div>
  );
}

function TrendTile({ trend, aside, onOpen }) {
  const [meta, setMeta] = useState(null);
  return (
    <button
      type="button"
      onClick={() => onOpen(trend)}
      className="w-full overflow-hidden rounded-[2rem] border border-gridBorder bg-white text-left shadow-sm transition-all hover:shadow-lg"
    >
      <ArtVisual trend={trend} onMetrics={setMeta} />
      <TrendFooter
        meta={meta}
        title={trend.name || "Untitled trend"}
        aside={aside ? (
          <span
            className="truncate text-[10px] font-extrabold uppercase tracking-wider text-accentPink"
            style={{ minWidth: 0 }}
          >
            {aside}
          </span>
        ) : null}
      />
    </button>
  );
}

export default function ArtTrends() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [trends, setTrends] = useState([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(false);
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const response = await axios.get(`${ART_TRENDS_URL}/categories`);
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") {
          setLimit(true);
          setLoading(false);
          return;
        }
        const next = normalizeCategories(outcome.kind === "success" ? outcome.data : {});
        setCategories(next);
        setCategory(pickDefault(next));
      } catch (err) {
        if (cancel) return;
        const outcome = interpretAiError(err);
        if (outcome.kind === "limit") {
          setLimit(true);
          setLoading(false);
          return;
        }
        setCategories([]);
        setCategory("trending");
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!category) return undefined;
    let cancel = false;
    (async () => {
      setLoading(true);
      setError("");
      setLimit(false);
      setSelected(null);
      try {
        const response = await axios.get(`${ART_TRENDS_URL}/browse`, { params: { category } });
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") setLimit(true);
        else if (outcome.kind === "success") {
          const data = outcome.data || {};
          setTrends(Array.isArray(data.trends) ? data.trends : []);
          setDisclaimer(typeof data.disclaimer === "string" ? data.disclaimer : "");
          setGeneratedAt(data.generated_at || "");
        } else setError(outcome.message || "Could not load trends.");
      } catch (err) {
        if (cancel) return;
        const outcome = interpretAiError(err);
        if (outcome.kind === "limit") setLimit(true);
        else setError(outcome.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [category]);

  useEffect(() => {
    if (!selected) return undefined;
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const chips = [{ id: "all", label: "All" }, ...(categories.length ? categories : [{ id: "trending", label: "Trending" }])];
  const isAll = category === "all";

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <PageHeader title={service.name} backTo="/ai-magic" backLabel="Back to AI Magic" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-primaryPurple">Free tool</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{service.name}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500 sm:text-base">
            Browse AI art trends. Open a card to read the full prompt and copy it.
          </p>
        </div>
        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
          {chips.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              className={category === item.id
                ? "rounded-full bg-primaryPurple px-3 py-1.5 text-xs font-bold text-white shadow-sm"
                : "rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple"}
            >
              {item.label}
            </button>
          ))}
        </div>
        {loading && (
          <div
            role="status"
            className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-gridBorder bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
            <p className="font-bold text-gray-800">Loading trends...</p>
          </div>
        )}
        {limit && !loading && <LimitNote />}
        {!limit && <ErrorNote message={error} />}
        {!loading && !limit && !error && (
          <div className="mt-8">
            {trends.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
                No trends in this category yet.
              </div>
            ) : (
              <Masonry>
                {trends.map((trend, index) => (
                  <TrendTile
                    key={trend.id ?? `${trend.name ?? "trend"}-${index}`}
                    trend={trend}
                    aside={isAll && trend.category ? categoryLabel(trend.category, categories) : ""}
                    onOpen={setSelected}
                  />
                ))}
              </Masonry>
            )}
            {disclaimer && (
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-500">{disclaimer}</p>
            )}
            {generatedAt && (
              <p className="mx-auto mt-2 max-w-2xl text-xs font-bold uppercase tracking-widest text-gray-400">
                Updated {String(generatedAt)}
              </p>
            )}
          </div>
        )}
      </main>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trend-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm outline-none sm:p-8"
            style={{ maxHeight: "90vh" }}
          >
            <ArtVisual trend={selected} />
            <h3 id="trend-title" className="mt-4 text-2xl font-black text-gray-900">
              {selected.name || "Untitled trend"}
            </h3>
            {selected.category && (
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                {categoryLabel(selected.category, categories)}
              </p>
            )}
            {selected.why_it_works && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{selected.why_it_works}</p>
            )}
            <CopyBlock label="Prompt" text={selected.prompt} buttonLabel="Copy prompt" />
            <CopyBlock label="Negative prompt" text={selected.negative_prompt} />
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
