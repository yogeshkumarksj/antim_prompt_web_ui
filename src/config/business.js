/**
 * Business details for policy, contact, about, and pricing pages.
 * Replace every [BRACKETED] value in this file before payment review.
 * API keys and payment secrets do not belong here.
 */

export const BUSINESS = {
  legalName: "[BUSINESS NAME]",
  brandName: "Antim Prompt",
  productName: "Prompt Karo",
  groupName: "Antim Group",
  ownerName: "Yogesh Kumar",
  address: "[ADDRESS]",
  supportEmail: "[SUPPORT EMAIL]",
  supportPhone: "[SUPPORT PHONE]",
  gstNumber: "[GST NUMBER]",
  refundWindow: "[REFUND WINDOW]",
  website: "https://antimprompt.com",
  websiteLabel: "antimprompt.com",
  country: "India",
  currency: "INR",
  lastUpdated: "15 November 2026",
};

export const SERVICES = [
  {
    id: "prompts",
    name: "Prompt Library",
    price: "Free",
    paid: false,
    route: "/",
    blurb: "Browse, search, copy, and save AI image prompts.",
    points: [
      "Search and filter the prompt catalogue",
      "Copy a prompt to your clipboard",
      "Save prompts in this browser",
    ],
    delivery: "Available immediately on the website.",
  },
  {
    id: "insta",
    name: "Insta Reach Booster",
    route: "/insta-audit",
    price: "[PRICE]",
    paid: true,
    blurb: "A paid digital profile score and growth notes for a public Instagram username.",
    points: [
      "Growth score and engagement snapshot",
      "Strengths, gaps, and content ideas",
      "Delivered on the audit page",
      "A usage cap can reply: Limit reached, try tomorrow.",
    ],
    delivery: "The report appears on the audit page when the scan finishes. Nothing is shipped.",
  },
  {
    id: "songs",
    name: "Viral Insta Songs",
    price: "Free",
    paid: false,
    route: "/viral-songs",
    blurb: "Free audio ideas for one niche, region, and language. Not a live Instagram scan.",
    points: [
      "Song titles, artists, and why they fit",
      "A reel idea, a hook, and hashtags",
      "A short guide for reusing the audio",
      "When the cap is spent the page says: Limit reached, try tomorrow.",
    ],
    delivery: "Shown on the Viral Insta Songs page. Nothing is shipped.",
  },
  {
    id: "art",
    name: "Viral AI Art Trends",
    price: "Free",
    paid: false,
    route: "/art-trends",
    blurb: "Free AI image styles and original prompts for one niche and platform.",
    points: [
      "Style notes and visual cues",
      "An image prompt and a negative prompt you can copy",
      "A caption idea and a repeatable workflow",
      "When the cap is spent the page says: Limit reached, try tomorrow.",
    ],
    delivery: "Shown on the Viral AI Art Trends page. Nothing is shipped.",
  },
  {
    id: "templates",
    name: "Viral Templates",
    price: "Free",
    paid: false,
    route: "/viral-templates",
    blurb: "Free photo templates. Upload a picture, add a short line when the template asks for one, and download the image.",
    points: [
      "A grid of templates, with category filters when they exist",
      "Your JPG, PNG, or WEBP photo, up to 5MB",
      "Share or download the finished image",
      "When the cap is spent the page says: Thodi der baad try karein.",
    ],
    delivery: "Shown on the Viral Templates page. Nothing is shipped.",
  },
];

export const PLACEHOLDERS = [
  {
    token: "[BUSINESS NAME]",
    key: "legalName",
    fill: "Legal business name, matching the name registered for payments",
  },
  {
    token: "[ADDRESS]",
    key: "address",
    fill: "Registered business address",
  },
  {
    token: "[SUPPORT EMAIL]",
    key: "supportEmail",
    fill: "Customer support email",
  },
  {
    token: "[SUPPORT PHONE]",
    key: "supportPhone",
    fill: "Customer support phone, with country code",
  },
  {
    token: "[GST NUMBER]",
    key: "gstNumber",
    fill: "GSTIN, or the words Not applicable if the business is not registered",
  },
  {
    token: "[PRICE]",
    key: "SERVICES insta price",
    fill: "INR price for one Insta Reach Booster scan, for example ₹199",
  },
  {
    token: "[REFUND WINDOW]",
    key: "refundWindow",
    fill: "How long a customer has to ask for a refund, for example 7 days",
  },
];

export function serviceById(id) {
  return SERVICES.find((service) => service.id === id);
}

export function isPlaceholder(value) {
  return typeof value === "string" && /^\[[^[\]]+\]$/.test(value.trim());
}

export function mailtoHref(email) {
  if (!email || isPlaceholder(email)) return null;
  return `mailto:${email.trim()}`;
}

export function telHref(phone) {
  if (!phone || isPlaceholder(phone)) return null;
  const compact = phone.replace(/[^\d+]/g, "");
  if (!compact) return null;
  return `tel:${compact}`;
}
