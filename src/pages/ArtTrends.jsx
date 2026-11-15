import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import AiToolScreen, { ReportList } from "../components/AiToolScreen";
import { ART_TRENDS_URL } from "../constants";
import { serviceById } from "../config/business";
import { artRequestBody, normalizeArtTrends } from "../utils/aiFeature";

const service = serviceById("art");

const fields = [
  {
    name: "niche",
    label: "Niche",
    required: true,
    maxLength: 80,
    placeholder: "ceramics",
  },
  {
    name: "platform",
    label: "Platform",
    maxLength: 40,
    placeholder: "Leave blank for Instagram",
  },
];

function CopyBlock({ label, text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-gridBorder bg-promptBox p-4">
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{text}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 inline-flex items-center text-sm font-bold text-primaryPurple hover:underline"
      >
        <Copy size={16} className="mr-1" />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function ArtResults({ result }) {
  const hasBody = result.summary || result.trends.length || result.workflow.length;
  if (!hasBody) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-gridBorder bg-white p-6 text-center text-sm font-medium text-gray-500">
        The report came back empty. Try a different niche.
      </div>
    );
  }

  const context = [result.niche, result.platform].filter(Boolean).join(" · ");

  return (
    <div className="space-y-6">
      {(result.summary || result.disclaimer) && (
        <div className="rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-3 flex items-center text-accentPink">
            <Sparkles size={20} className="mr-2" />
            <h3 className="text-lg font-black text-gray-900">Style notes</h3>
          </div>
          {result.summary && (
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{result.summary}</p>
          )}
          {context && (
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400">{context}</p>
          )}
          {result.disclaimer && (
            <p className="mt-4 text-sm leading-relaxed text-gray-500">{result.disclaimer}</p>
          )}
        </div>
      )}

      {result.trends.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {result.trends.map((trend) => (
            <article
              key={trend.id}
              className="overflow-hidden rounded-[2rem] border border-gridBorder bg-white shadow-sm"
            >
              {trend.imageUrl && (
                <img
                  src={trend.imageUrl}
                  alt=""
                  className="h-44 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-black tracking-tight text-gray-900">{trend.name}</h3>
                {trend.why && <p className="mt-3 text-sm leading-relaxed text-gray-600">{trend.why}</p>}
                {trend.visualCues.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trend.visualCues.map((cue) => (
                      <span
                        key={cue}
                        className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-accentPink"
                      >
                        {cue}
                      </span>
                    ))}
                  </div>
                )}
                {trend.caption && (
                  <p className="mt-3 text-sm text-gray-700">
                    <span className="font-black text-gray-400">Caption · </span>
                    {trend.caption}
                  </p>
                )}
                {trend.prompt && <CopyBlock label="Prompt" text={trend.prompt} />}
                {trend.negativePrompt && (
                  <CopyBlock label="Negative prompt" text={trend.negativePrompt} />
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ReportList title="Workflow" items={result.workflow} />
    </div>
  );
}

export default function ArtTrends() {
  return (
    <AiToolScreen
      title={service.name}
      description="Enter a niche. Platform is optional and defaults to Instagram on the server. This asks for free style notes and original prompts. It is not a live Instagram scrape."
      submitLabel="SHOW TRENDS"
      loadingLabel="Checking AI art trends..."
      price={service.price}
      paid={service.paid}
      examples={["Ceramics", "Portrait", "Product photo", "Festive"]}
      fields={fields}
      endpoint={ART_TRENDS_URL}
      buildBody={artRequestBody}
      normalize={normalizeArtTrends}
      renderResult={(result) => <ArtResults result={result} />}
    />
  );
}
