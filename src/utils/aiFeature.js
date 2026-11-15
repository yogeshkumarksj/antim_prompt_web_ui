/**
 * Viral Insta Songs: POST /ai-magic/viral-insta-songs
 *   { niche, region?, language? }
 * Viral AI Art Trends: POST /ai-magic/viral-ai-art-trends
 *   { niche, platform? }
 *
 * Success body: { status: "success", billing, disclaimer, summary, ... }
 * A spent cap is HTTP 429 with detail "Limit reached, try tomorrow."
 * The screen shows that same sentence.
 */

export const DAILY_LIMIT_MESSAGE = "Limit reached, try tomorrow.";

const LIMIT_STATUSES = new Set([
  "limit_reached",
  "daily_limit",
  "daily_limit_reached",
]);

export function detailText(data) {
  if (!data || typeof data !== "object") return "";
  const detail = data.detail ?? data.message ?? data.error ?? "";
  if (typeof detail === "string") return detail.trim();
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item.msg === "string") return item.msg;
        return "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

export function isDailyLimit(statusCode, data) {
  const status = String(data?.status || data?.code || "").toLowerCase();
  if (LIMIT_STATUSES.has(status)) return true;
  const text = `${detailText(data)} ${status}`.toLowerCase().replace(/\.$/, "");
  if (text.includes("limit reached, try tomorrow")) return true;
  if (/daily limit|try again tomorrow/.test(text)) return true;
  if (statusCode === 429 && /limit reached/.test(text) && /tomorrow/.test(text)) {
    return true;
  }
  return false;
}

export function songsRequestBody(values) {
  const body = { niche: String(values.niche || "").trim() };
  const region = String(values.region || "").trim();
  const language = String(values.language || "").trim();
  if (region) body.region = region;
  if (language) body.language = language;
  return body;
}

export function artRequestBody(values) {
  const body = { niche: String(values.niche || "").trim() };
  const platform = String(values.platform || "").trim();
  if (platform) body.platform = platform;
  return body;
}

export function interpretAiResponse(response) {
  const data = response?.data ?? {};
  if (isDailyLimit(response?.status, data)) {
    return { kind: "limit", message: DAILY_LIMIT_MESSAGE };
  }
  if (data.status === "success") {
    return { kind: "success", data };
  }
  return {
    kind: "error",
    message: detailText(data) || "Something went wrong. Please try again.",
  };
}

export function interpretAiError(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;
  if (isDailyLimit(status, data)) {
    return { kind: "limit", message: DAILY_LIMIT_MESSAGE };
  }
  if (!error?.response) {
    return {
      kind: "error",
      message: "Could not reach the server. Check your connection and try again.",
    };
  }
  return {
    kind: "error",
    message: detailText(data) || "Something went wrong. Please try again.",
  };
}

function asList(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item != null && item !== "");
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function reportOf(data) {
  if (data.ai_report && typeof data.ai_report === "object") return data.ai_report;
  if (data.ai_audit && typeof data.ai_audit === "object") return data.ai_audit;
  if (data.report && typeof data.report === "object") return data.report;
  return {};
}

export function safeHttpUrl(value) {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return "";
  }
  return "";
}

function asTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(/[,#]/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function normalizeSongs(data) {
  const report = reportOf(data);
  const raw = data.songs || report.songs || [];
  const songs = asList(raw).map((item, index) => {
    if (typeof item === "string") {
      return {
        id: index,
        title: item,
        artist: "",
        why: "",
        reelIdea: "",
        hook: "",
        hashtags: [],
      };
    }
    return {
      id: item.id ?? index,
      title: item.title || item.name || item.song || "Untitled track",
      artist: item.artist || item.creator || "",
      why: item.why_trending || item.why || item.reason || "",
      reelIdea: item.reel_idea || item.best_for || item.use_for || "",
      hook: item.hook || "",
      hashtags: asTags(item.hashtags),
    };
  });
  const input = data.input && typeof data.input === "object" ? data.input : {};

  return {
    niche: input.niche || data.niche || "",
    region: input.region || "",
    language: input.language || "",
    summary: data.summary || report.summary || "",
    disclaimer: data.disclaimer || "",
    billing: data.billing || "",
    songs,
    howToUse: asList(data.how_to_use || report.how_to_use || data.recommendations),
  };
}

export function normalizeArtTrends(data) {
  const report = reportOf(data);
  const raw = data.trends || report.trends || [];
  const trends = asList(raw).map((item, index) => {
    if (typeof item === "string") {
      return {
        id: index,
        name: item,
        why: "",
        visualCues: [],
        prompt: "",
        negativePrompt: "",
        caption: "",
        imageUrl: "",
      };
    }
    return {
      id: item.id ?? index,
      name: item.name || item.title || "Untitled trend",
      why: item.why_it_works || item.why_viral || item.why || "",
      visualCues: asTags(item.visual_cues),
      prompt: item.prompt || item.prompt_example || item.example_prompt || "",
      negativePrompt: item.negative_prompt || "",
      caption: item.caption_idea || "",
      imageUrl: safeHttpUrl(item.image_url || item.preview_url || item.thumbnail_url),
    };
  });
  const input = data.input && typeof data.input === "object" ? data.input : {};

  return {
    niche: input.niche || data.niche || "",
    platform: input.platform || "",
    summary: data.summary || report.summary || "",
    disclaimer: data.disclaimer || "",
    billing: data.billing || "",
    trends,
    workflow: asList(data.workflow || report.workflow || data.recommendations),
  };
}
