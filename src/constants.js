// src/constants.js

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://prompt-karo-backend.onrender.com";
export const APP_NAME = "Antim Prompt";
export const APP_TAGLINE = "Discover, Copy & Share the Best AI Prompts";

/** Chart pages GET `${VIRAL_SONGS_URL}/categories` and `/top?category=`. */
export const VIRAL_SONGS_URL = `${BASE_URL}/ai-magic/viral-insta-songs`;
/** Chart page GETs `${ART_TRENDS_URL}/categories` and `/browse?category=`. */
export const ART_TRENDS_URL = `${BASE_URL}/ai-magic/viral-ai-art-trends`;
