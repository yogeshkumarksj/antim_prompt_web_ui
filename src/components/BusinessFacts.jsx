import { BUSINESS, isPlaceholder, mailtoHref, telHref } from "../config/business";

export function MarkedText({ value }) {
  if (isPlaceholder(value)) {
    return (
      <span className="inline-block rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-800">
        {value}
      </span>
    );
  }
  return value;
}

export function PriceLabel({ price }) {
  if (!price || price === "Free") return "Free";
  if (isPlaceholder(price)) {
    return (
      <>
        <MarkedText value={price} /> {BUSINESS.currency}
      </>
    );
  }
  return price;
}

function FactValue({ value, href }) {
  const marked = isPlaceholder(value);
  const content = <MarkedText value={value} />;

  if (href && !marked) {
    return (
      <a href={href} className="font-bold text-primaryPurple hover:underline">
        {content}
      </a>
    );
  }
  return <span className="font-semibold text-gray-800">{content}</span>;
}

export default function BusinessFacts({ includeOwner = false }) {
  const rows = [
    ["Legal name", BUSINESS.legalName],
    ["Brand", `${BUSINESS.brandName} (${BUSINESS.productName})`],
    ["Group", BUSINESS.groupName],
    includeOwner ? ["Owner", BUSINESS.ownerName] : null,
    ["Registered address", BUSINESS.address],
    ["Email", BUSINESS.supportEmail, mailtoHref(BUSINESS.supportEmail)],
    ["Phone", BUSINESS.supportPhone, telHref(BUSINESS.supportPhone)],
    ["GSTIN", BUSINESS.gstNumber],
    ["Website", BUSINESS.websiteLabel, BUSINESS.website],
  ].filter(Boolean);

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {rows.map(([label, value, href]) => (
        <div key={label} className="rounded-2xl border border-gridBorder bg-promptBox px-4 py-3">
          <dt className="text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</dt>
          <dd className="mt-1 text-sm leading-relaxed break-words">
            <FactValue value={value} href={href} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
