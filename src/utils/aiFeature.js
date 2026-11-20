/**
 * Viral Insta Songs chart: GET /ai-magic/viral-insta-songs/top?category=
 *   songs include cover_url, preview_url, track_url, reels_count (may be null).
 * Viral AI Art Trends chart: GET /ai-magic/viral-ai-art-trends/browse?category=
 *
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
