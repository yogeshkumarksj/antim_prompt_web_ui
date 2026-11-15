import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Clock, ShieldAlert } from "lucide-react";
import PageHeader from "./PageHeader";
import SiteFooter from "./SiteFooter";
import { PriceLabel } from "./BusinessFacts";
import { DAILY_LIMIT_MESSAGE, interpretAiError, interpretAiResponse } from "../utils/aiFeature";

export default function AiToolScreen({
  title,
  description,
  submitLabel,
  loadingLabel,
  price,
  paid,
  endpoint,
  fields,
  buildBody,
  normalize,
  examples,
  renderResult,
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""]))
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const clearOutcome = () => {
    setResult(null);
    setError("");
    setLimitReached(false);
  };

  const setField = (name, next) => {
    setValues((current) => ({ ...current, [name]: next }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const niche = String(values.niche || "").trim();
    if (niche.length < 2) {
      clearOutcome();
      setError("Enter a niche of at least 2 characters.");
      return;
    }

    setLoading(true);
    clearOutcome();

    try {
      const response = await axios.post(endpoint, buildBody(values));
      const outcome = interpretAiResponse(response);
      if (outcome.kind === "limit") setLimitReached(true);
      else if (outcome.kind === "success") setResult(normalize(outcome.data));
      else setError(outcome.message);
    } catch (err) {
      const outcome = interpretAiError(err);
      if (outcome.kind === "limit") setLimitReached(true);
      else setError(outcome.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <PageHeader title={title} backTo="/ai-magic" backLabel="Back to AI Magic" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-primaryPurple">
            {paid ? (
              <>
                Paid digital service · <PriceLabel price={price} />
              </>
            ) : (
              "Free tool"
            )}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500 sm:text-base">
            {description}
          </p>
          {paid && (
            <p className="mt-3 text-sm text-gray-500">
              Published price: <PriceLabel price={price} />.{" "}
              <Link to="/pricing" className="font-bold text-primaryPurple hover:underline">
                See pricing
              </Link>
              {" · "}
              <Link to="/contact" className="font-bold text-primaryPurple hover:underline">
                Contact us to purchase
              </Link>
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-3 rounded-[2rem] border border-gridBorder bg-white p-4 shadow-sm sm:p-6"
        >
          {fields.map((field) => (
            <label key={field.name} className="block" htmlFor={`ai-${field.name}`}>
              <span className="mb-1 block text-[11px] font-black uppercase tracking-widest text-gray-400">
                {field.label}
                {field.required ? "" : " · optional"}
              </span>
              <input
                id={`ai-${field.name}`}
                type="text"
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(event) => setField(field.name, event.target.value)}
                className="w-full rounded-2xl border border-gridBorder bg-promptBox p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primaryPurple/20 sm:text-base"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primaryPurple px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Working..." : submitLabel}
          </button>
        </form>

        {examples?.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setField("niche", example)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gridBorder hover:text-primaryPurple"
              >
                {example}
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
            <p className="font-bold text-gray-800">{loadingLabel}</p>
            <p className="mt-1 text-sm text-gray-500">This usually takes a few seconds.</p>
          </div>
        )}

        {limitReached && !loading && (
          <div
            role="status"
            className="mx-auto mt-8 flex max-w-2xl gap-3 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6"
          >
            <Clock className="mt-0.5 shrink-0" />
            <div>
              <p className="text-lg font-black">{DAILY_LIMIT_MESSAGE}</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900">
                Today&apos;s allowance for this tool is used up. Come back tomorrow to run it again.
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600"
          >
            <ShieldAlert className="mt-0.5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {result && !loading && <div className="mt-10">{renderResult(result)}</div>}
      </main>
      <SiteFooter />
    </div>
  );
}

export function ReportList({ title, items, tone = "purple" }) {
  if (!items?.length) return null;
  const dot = tone === "blue" ? "bg-secondaryBlue" : "bg-primaryPurple";
  return (
    <div className="rounded-[2rem] border border-gridBorder bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start text-sm font-medium text-gray-700">
            <span className={`mr-3 mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
