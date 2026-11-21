import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertCircle, Clock, Copy } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import { serviceById } from "../config/business";
import { VIRAL_SONGS_URL } from "../constants";
import { interpretAiError, interpretAiResponse, safeHttpUrl } from "../utils/aiFeature";

const service = serviceById("songs");
const COVER_SIZE = 64;

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

function reelsLabel(count) {
  if (typeof count !== "number" || !Number.isFinite(count)) return "";
  const noun = count === 1 ? "reel" : "reels";
  return `Used in ${count} ${noun}`;
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
      || Array.isArray(data.songs)
      || Array.isArray(data.categories)
      || Array.isArray(data.items)
      || data.status === "success"
    )
  ) {
    return { kind: "success", data };
  }
  return judged;
}

function readSongs(data, isAll) {
  const songs = Array.isArray(data?.songs) ? [...data.songs] : [];
  songs.sort((a, b) => {
    const rank = (song) => Number(isAll ? (song.overall_rank ?? song.rank ?? 0) : (song.rank ?? 0));
    return rank(a) - rank(b);
  });
  return {
    songs: songs.slice(0, 20),
    disclaimer: typeof data?.disclaimer === "string" ? data.disclaimer : "",
    generatedAt: data?.generated_at || "",
  };
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

function CoverPlaceholder({ gradientId }) {
  const stroke = `url(#${gradientId})`;
  return (
    <div
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-purple-50"
      style={{ width: COVER_SIZE, height: COVER_SIZE }}
      aria-hidden="true"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
        <path d="M9 18V5l12-2v13" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" stroke={stroke} strokeWidth="2" />
        <circle cx="18" cy="16" r="3" stroke={stroke} strokeWidth="2" />
      </svg>
    </div>
  );
}

function CoverArt({ song, gradientId }) {
  const src = httpUrl(song?.cover_url);
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [src]);
  if (src && !broken) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        width={COVER_SIZE}
        height={COVER_SIZE}
        onError={() => setBroken(true)}
        className="h-16 w-16 shrink-0 rounded-2xl bg-purple-50 object-cover"
        style={{ width: COVER_SIZE, height: COVER_SIZE }}
      />
    );
  }
  return <CoverPlaceholder gradientId={gradientId} />;
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function ChartSong({ song, index, isAll, categories, copied, onCopy, playingKey, onPlay }) {
  const rank = isAll ? (song.overall_rank ?? song.rank ?? index + 1) : (song.rank ?? index + 1);
  const tags = Array.isArray(song.hashtags) ? song.hashtags : [];
  const searchText = typeof song.search_text === "string" ? song.search_text : "";
  const key = `${song.rank ?? index}-${song.title ?? index}`;
  const reels = reelsLabel(song.reels_count);
  const preview = httpUrl(song?.preview_url);
  const playing = playingKey === key;
  return (
    <article className="song-chart-card rounded-[2rem] border border-gridBorder bg-white p-5 shadow-sm sm:p-6">
      <div className="song-chart-rank flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-lg font-black text-primaryPurple">
        {rank}
      </div>
      <div className="song-chart-cover" style={{ position: "relative", width: COVER_SIZE, height: COVER_SIZE }}>
        <CoverArt song={song} gradientId={`song-cover-${index}`} />
        {preview ? (
          <button
            type="button"
            aria-label={playing ? "Pause preview" : "Play preview"}
            aria-pressed={playing}
            onClick={() => onPlay(key, preview)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 28,
              height: 28,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 0,
              borderRadius: 999,
              padding: 0,
              background: "rgba(15, 23, 42, 0.55)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
        ) : null}
      </div>
      <div className="song-chart-body" style={{ minWidth: 0 }}>
        <h3 className="break-words text-xl font-black tracking-tight text-gray-900">
          {song.title || "Untitled track"}
        </h3>
        {song.artist && (
          <p className="mt-1 break-words text-sm font-bold text-secondaryBlue">{song.artist}</p>
        )}
        {isAll && (song.category || song.rank != null) && (
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
            {[categoryLabel(song.category, categories), song.rank != null ? `#${song.rank}` : ""]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {song.why_trending && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{song.why_trending}</p>
        )}
        {reels && <p className="mt-2 text-xs font-bold text-gray-500">{reels}</p>}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${key}-${tag}`}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600"
              >
                #{String(tag).replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        disabled={!searchText}
        onClick={() => onCopy(key, searchText)}
        className="song-chart-copy inline-flex shrink-0 items-center text-sm font-bold text-primaryPurple hover:underline disabled:opacity-50"
      >
        <Copy size={16} className="mr-1" />
        {copied === key ? "Copied" : "Copy"}
      </button>
    </article>
  );
}

export default function ViralSongs() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [chart, setChart] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState("");
  const [chartLimit, setChartLimit] = useState(false);
  const [copied, setCopied] = useState("");
  const [playingKey, setPlayingKey] = useState("");
  const audioRef = useRef(null);
  const playTicket = useRef(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    const onEnded = () => setPlayingKey("");
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    audioRef.current?.pause();
    setPlayingKey("");
  }, [category]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const response = await axios.get(`${VIRAL_SONGS_URL}/categories`);
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") {
          setChartLimit(true);
          setChartLoading(false);
          return;
        }
        const next = normalizeCategories(outcome.kind === "success" ? outcome.data : {});
        setCategories(next);
        setCategory(pickDefault(next));
      } catch (error) {
        if (cancel) return;
        const outcome = interpretAiError(error);
        if (outcome.kind === "limit") {
          setChartLimit(true);
          setChartLoading(false);
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
      setChartLoading(true);
      setChartError("");
      setChartLimit(false);
      try {
        const response = await axios.get(`${VIRAL_SONGS_URL}/top`, { params: { category } });
        const outcome = readOk(response);
        if (cancel) return;
        if (outcome.kind === "limit") setChartLimit(true);
        else if (outcome.kind === "success") setChart(readSongs(outcome.data, category === "all"));
        else setChartError(outcome.message || "Could not load songs.");
      } catch (error) {
        if (cancel) return;
        const outcome = interpretAiError(error);
        if (outcome.kind === "limit") setChartLimit(true);
        else setChartError(outcome.message);
      } finally {
        if (!cancel) setChartLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [category]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(""), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copySearch = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied("");
    }
  };

  const togglePreview = async (key, url) => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    const same = audio.dataset.songKey === key;
    if (same && !audio.paused) {
      audio.pause();
      setPlayingKey("");
      return;
    }
    const ticket = ++playTicket.current;
    if (!same) {
      audio.src = url;
      audio.dataset.songKey = key;
      audio.currentTime = 0;
    } else if (audio.ended) {
      audio.currentTime = 0;
    }
    try {
      await audio.play();
      if (ticket === playTicket.current) setPlayingKey(key);
    } catch {
      if (ticket === playTicket.current) setPlayingKey("");
    }
  };

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
            Trending sounds, ranked. Copy a song name and search it on Instagram or Facebook.
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
        {chartLoading && (
          <div
            role="status"
            className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-gridBorder bg-white p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
            <p className="font-bold text-gray-800">Loading songs...</p>
          </div>
        )}
        {chartLimit && !chartLoading && <LimitNote />}
        {!chartLimit && <ErrorNote message={chartError} />}
        {!chartLoading && !chartLimit && !chartError && chart && (
          <div className="mt-8 space-y-4">
            {chart.songs.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
                No songs in this category yet.
              </div>
            ) : chart.songs.map((song, index) => (
              <ChartSong
                key={`${song.rank ?? index}-${song.title ?? index}`}
                song={song}
                index={index}
                isAll={isAll}
                categories={categories}
                copied={copied}
                onCopy={copySearch}
                playingKey={playingKey}
                onPlay={togglePreview}
              />
            ))}
            {chart.disclaimer && (
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500">{chart.disclaimer}</p>
            )}
            {chart.generatedAt && (
              <p className="mx-auto max-w-2xl text-xs font-bold uppercase tracking-widest text-gray-400">
                Updated {String(chart.generatedAt)}
              </p>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
