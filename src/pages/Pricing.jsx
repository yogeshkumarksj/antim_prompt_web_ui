import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { MarkedText, PriceLabel } from "../components/BusinessFacts";
import { BUSINESS, SERVICES } from "../config/business";

export default function Pricing() {
  return (
    <LegalPage title="Pricing" kicker="Digital services">
      <LegalSection title="Free tools and paid reports">
        <p>
          {BUSINESS.brandName} has free features and paid features. Paid features are digital
          services from <strong>{BUSINESS.legalName}</strong>. They are delivered on this website.
          We do not charge shipping because we do not ship physical goods. Prices are in{" "}
          {BUSINESS.currency}. GSTIN: <MarkedText value={BUSINESS.gstNumber} />.
        </p>
      </LegalSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SERVICES.map((service) => (
          <article
            key={service.id}
            className={`flex flex-col rounded-[2rem] border bg-white p-6 shadow-sm ${
              service.paid ? "border-primaryPurple/30" : "border-gridBorder"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black tracking-tight text-gray-900">{service.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  service.paid ? "bg-purple-50 text-primaryPurple" : "bg-green-50 text-green-700"
                }`}
              >
                {service.paid ? "Paid" : "Free"}
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-gray-900">
              <PriceLabel price={service.price} />
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
              {service.paid ? "Per digital scan" : "No charge"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{service.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {service.points.map((point) => (
                <li key={point} className="flex items-start">
                  <span className="mr-2 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primaryPurple" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">{service.delivery}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to={service.route}
                className="rounded-2xl bg-primaryPurple px-4 py-3 text-center text-sm font-bold text-white"
              >
                Open
              </Link>
              {service.paid && (
                <Link
                  to="/contact"
                  className="rounded-2xl bg-gray-100 px-4 py-3 text-center text-sm font-bold text-gray-700"
                >
                  Contact us to purchase
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <LegalSection title="Payment and tax">
        <p>
          Free tools can be used without paying. For a paid report, the price above is the
          published price. Online card and UPI payments, when collected, are handled by a payment
          gateway. We do not store card numbers, CVV, or UPI PIN on this website. This page does
          not take a payment itself. To buy, use{" "}
          <Link to="/contact" className="font-bold text-primaryPurple hover:underline">
            Contact Us
          </Link>
          .
        </p>
        <p>
          If a paid report is not delivered, the{" "}
          <Link to="/refund-policy" className="font-bold text-primaryPurple hover:underline">
            Refund & Cancellation Policy
          </Link>{" "}
          explains when the charge is returned. Delivery is described in the{" "}
          <Link to="/shipping-policy" className="font-bold text-primaryPurple hover:underline">
            Shipping & Delivery Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Business">
        <BusinessFacts />
      </LegalSection>
    </LegalPage>
  );
}
