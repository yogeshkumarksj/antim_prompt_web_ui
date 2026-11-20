import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { BASE_URL } from "../constants";

const TEMPLATES_URL = `${BASE_URL}/ai-magic/story-card/templates`;
const GENERATE_URL = `${BASE_URL}/ai-magic/story-card`;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const RATE_LIMIT = "Thodi der baad try karein";

function backendUrl(path) {
  if (typeof path !== "string" || !path.trim()) return "";
  try {
    const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
    return new URL(path.trim(), base).href;
  } catch {
    return "";
  }
}

function storyError(error, fallback) {
  if (error?.response?.status === 429) return RATE_LIMIT;
  if (!error?.response) return "Could not reach the server. Check your connection and try again.";
  return fallback;
}

function filesShareable(file) {
  if (!file || typeof navigator.canShare !== "function") return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function asPng(response) {
  const blob = response?.data;
  if (!blob) return null;
  const header = String(response.headers?.["content-type"] || blob.type || "");
  if (/json|text|html|xml/.test(header)) return null;
  if (blob.type === "image/png") return blob;
  return new Blob([blob], { type: "image/png" });
}

export default function StoryCardModal({ song, onClose }) {
  const dialogRef = useRef(null);
  const cardUrlRef = useRef("");
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templateId, setTemplateId] = useState("");
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [cardFile, setCardFile] = useState(null);
  const [shareable, setShareable] = useState(false);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => () => {
    if (cardUrlRef.current) URL.revokeObjectURL(cardUrlRef.current);
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setTemplatesLoading(true);
      setError("");
      try {
        const response = await axios.get(TEMPLATES_URL);
        if (cancel) return;
        const list = Array.isArray(response.data?.templates) ? response.data.templates : [];
        setTemplates(list);
        const first = list[0]?.id;
        setTemplateId(first == null ? "" : String(first));
      } catch (err) {
        if (cancel) return;
        setTemplates([]);
        setError(storyError(err, "Could not load templates."));
      } finally {
        if (!cancel) setTemplatesLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const onPhoto = (event) => {
    const file = event.target.files?.[0];
    setPhotoError("");
    if (!file) {
      setPhoto(null);
      return;
    }
    const extOk = /\.(jpe?g|png|webp)$/i.test(file.name);
    const typeOk = !file.type || PHOTO_TYPES.has(file.type);
    if (!extOk || !typeOk || file.size > MAX_PHOTO_BYTES) {
      setPhoto(null);
      event.target.value = "";
      setPhotoError("Use a JPG, PNG, or WEBP photo up to 5MB.");
      return;
    }
    setPhoto(file);
  };

  const showCard = (blob) => {
    const file = new File([blob], "story-card.png", { type: "image/png" });
    const url = URL.createObjectURL(file);
    if (cardUrlRef.current) URL.revokeObjectURL(cardUrlRef.current);
    cardUrlRef.current = url;
    setCardUrl(url);
    setCardFile(file);
    setShareable(filesShareable(file));
  };

  const generate = async (event) => {
    event.preventDefault();
    if (!templateId) {
      setError("Pick a template.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const form = new FormData();
      form.append("template_id", templateId);
      form.append("song_title", song.title || "");
      form.append("artist", song.artist || "");
      form.append("cover_url", typeof song.cover_url === "string" ? song.cover_url : "");
      form.append("caption", caption.trim());
      if (photo) form.append("photo", photo);
      const response = await axios.post(GENERATE_URL, form, { responseType: "blob" });
      const png = asPng(response);
      if (!png) {
        setError("Something went wrong. Please try again.");
        return;
      }
      showCard(png);
    } catch (err) {
      setError(storyError(err, "Something went wrong. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const downloadCard = () => {
    if (!cardUrl) return;
    const link = document.createElement("a");
    link.href = cardUrl;
    link.download = "story-card.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const shareCard = async () => {
    if (!cardFile) return;
    try {
      await navigator.share({ files: [cardFile] });
    } catch (err) {
      if (err?.name === "AbortError") return;
      setShareable(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-card-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm outline-none sm:p-8"
        style={{ maxHeight: "90vh" }}
      >
        <h3 id="story-card-title" className="text-2xl font-black tracking-tight text-gray-900">
          Make Story Card
        </h3>
        <p className="mt-1 text-sm font-bold text-secondaryBlue">
          {[song.title || "Untitled track", song.artist].filter(Boolean).join(" · ")}
        </p>

        <form onSubmit={generate} className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-gray-400">Template</p>
            {templatesLoading && (
              <div role="status" className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <span className="h-6 w-6 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
                Loading templates...
              </div>
            )}
            {!templatesLoading && templates.length === 0 && !error && (
              <p className="text-sm font-medium text-gray-500">No templates yet.</p>
            )}
            {templates.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {templates.map((item) => {
                  const id = String(item.id);
                  const preview = backendUrl(item.preview_url);
                  const selected = templateId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTemplateId(id)}
                      className={selected
                        ? "w-24 shrink-0 rounded-2xl bg-white p-1 text-left ring-2 ring-primaryPurple"
                        : "w-24 shrink-0 rounded-2xl bg-white p-1 text-left ring-1 ring-gridBorder"}
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt=""
                          className="h-32 w-full rounded-xl bg-purple-50 object-cover"
                        />
                      ) : (
                        <span className="block h-32 w-full rounded-xl bg-purple-50" />
                      )}
                      <span className="mt-1 block truncate px-1 text-xs font-bold text-gray-700">
                        {item.name || id}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-gray-400">
              Your photo · optional
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={onPhoto}
              className="w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none"
            />
            {photo && <p className="mt-1 text-xs font-bold text-gray-500">{photo.name}</p>}
          </label>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
              Caption · optional
              <span>{caption.length}/80</span>
            </span>
            <input
              type="text"
              maxLength={80}
              value={caption}
              placeholder="Short line for the story"
              onChange={(event) => setCaption(event.target.value.slice(0, 80))}
              className="w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primaryPurple/20 sm:text-base"
            />
          </label>

          {photoError && <p className="text-sm font-medium text-red-600">{photoError}</p>}
          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
              <AlertCircle className="mt-0.5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={generating || templatesLoading || !templateId}
            className="w-full rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 sm:w-auto"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </form>

        {generating && (
          <div role="status" className="mt-4 flex items-center gap-3 text-sm font-bold text-gray-700">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
            Making your story card...
          </div>
        )}

        {cardUrl && (
          <div className="mt-6">
            <img
              src={cardUrl}
              alt="Story card preview"
              width={1080}
              height={1920}
              className="mx-auto w-full max-w-[270px] rounded-2xl bg-gray-100 object-contain"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {shareable && (
                <button
                  type="button"
                  onClick={shareCard}
                  className="rounded-2xl bg-primaryPurple px-6 py-3 text-sm font-bold text-white"
                >
                  Share
                </button>
              )}
              <button
                type="button"
                onClick={downloadCard}
                className="rounded-2xl bg-primaryPurple px-6 py-3 text-sm font-bold text-white"
              >
                Download
              </button>
            </div>
            {!shareable && (
              <p className="mt-3 text-sm font-medium text-gray-500">
                Download karke Instagram Story mein upload karein
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-2xl bg-gray-100 px-8 py-4 font-bold text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
