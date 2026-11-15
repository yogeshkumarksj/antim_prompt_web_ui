import PageHeader from "./PageHeader";
import SiteFooter from "./SiteFooter";
import { BUSINESS } from "../config/business";

export function LegalSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-gray-700 sm:text-base">{children}</div>
    </section>
  );
}

export default function LegalPage({ title, kicker, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <PageHeader title={title} backTo="/" backLabel="Back to home" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-10">
        <article className="rounded-3xl border border-gridBorder bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primaryPurple">{kicker}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">Last updated: {BUSINESS.lastUpdated}</p>
          <div className="mt-8 space-y-8">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
