import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { BASE_URL, VIRAL_TEMPLATES_URL } from "../constants";

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

function requestError(error, fallback) {
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

function wantsText(template) {
  return Boolean(template?.has_text);
}

export default function TemplateEditor({ template, onClose }) {
  const dialogRef = useRef(null);
  const cardUrlRef = useRef("");
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [text, setText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [cardFile, setCardFile] = useState(null);
  const [shareable, setShareable] = useState(false);
  const showText = wantsText(template);

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
    const file = new File([blob], "viral-template.png", { type: "image/png" });
    const url = URL.createObjectURL(file);
    if (cardUrlRef.current) URL.revokeObjectURL(cardUrlRef.current);
    cardUrlRef.current = url;
    setCardUrl(url);
    setCardFile(file);
    setShareable(filesShareable(file));
  };

  const generate = async (event) => {
    event.preventDefault();
    if (!photo) {
      setPhotoError("Add a JPG, PNG, or WEBP photo up to 5MB.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const form = new FormData();
      form.append("photo", photo);
      form.append("text", showText ? text.trim() : "");
      const response = await axios.post(
        `${VIRAL_TEMPLATES_URL}/${encodeURIComponent(template.id)}/render`,
        form,
        { responseType: "blob" },
      );
      const png = asPng(response);
      if (!png) {
        setError("Something went wrong. Please try again.");
        return;
      }
      showCard(png);
    } catch (err) {
      setError(requestError(err, "Something went wrong. Please try again."));
    } finally {
      setGenerating(false);
    }
  };

  const downloadCard = () => {
    if (!cardUrl) return;
    const link = document.createElement("a");
    link.href = cardUrl;
    link.download = "viral-template.png";
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

  const preview = backendUrl(template.preview_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-editor-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm outline-none sm:p-8"
        style={{ maxHeight: "90vh" }}
      >
        <h3 id="template-editor-title" className="text-2xl font-black tracking-tight text-gray-900">
          {template.name || "Template"}
        </h3>
        {template.category && (
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
            {template.category}
          </p>
        )}
        {preview && (
          <img
            src={preview}
            alt=""
            className="mt-4 max-h-48 w-auto rounded-2xl bg-purple-50 object-contain"
          />
        )}

        <form onSubmit={generate} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-gray-400">
              Your photo
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={onPhoto}
              className="w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none"
            />
            {photo && <p className="mt-1 text-xs font-bold text-gray-500">{photo.name}</p>}
          </label>

          {showText && (
            <label className="block">
              <span className="mb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                Text · optional
                <span>{text.length}/80</span>
              </span>
              <input
                type="text"
                maxLength={80}
                value={text}
                placeholder="Short line for the template"
                onChange={(event) => setText(event.target.value.slice(0, 80))}
                className="w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primaryPurple/20 sm:text-base"
              />
            </label>
          )}

          {photoError && <p className="text-sm font-medium text-red-600">{photoError}</p>}
          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600">
              <AlertCircle className="mt-0.5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={generating || !photo}
            className="w-full rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 sm:w-auto"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </form>

        {generating && (
          <div role="status" className="mt-4 flex items-center gap-3 text-sm font-bold text-gray-700">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-purple-100 border-t-primaryPurple" />
            Making your image...
          </div>
        )}

        {cardUrl && (
          <div className="mt-6">
            <img
              src={cardUrl}
              alt="Rendered template"
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
