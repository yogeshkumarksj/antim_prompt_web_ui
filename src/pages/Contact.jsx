import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { MarkedText } from "../components/BusinessFacts";
import { BUSINESS, isPlaceholder, mailtoHref, telHref } from "../config/business";

function ContactLine({ icon, label, value, href }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gridBorder bg-promptBox p-4">
      <div className="rounded-xl bg-white p-2 text-primaryPurple shadow-sm">{icon}</div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        {href && !isPlaceholder(value) ? (
          <a href={href} className="mt-1 block font-bold text-primaryPurple hover:underline break-all">
            {value}
          </a>
        ) : (
          <p className="mt-1 font-semibold text-gray-800 break-words">
            <MarkedText value={value} />
          </p>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <LegalPage title="Contact Us" kicker={BUSINESS.brandName}>
      <LegalSection title="Talk to us">
        <p>
          {BUSINESS.brandName} ({BUSINESS.productName}) is operated by{" "}
          <strong>{BUSINESS.legalName}</strong>. {BUSINESS.ownerName} is the owner. Use the details
          below for support, a purchase of a paid digital service, or a refund request.
        </p>
      </LegalSection>

      <div className="grid grid-cols-1 gap-3">
        <ContactLine icon={<MapPin size={18} />} label="Registered address" value={BUSINESS.address} />
        <ContactLine
          icon={<Mail size={18} />}
          label="Support email"
          value={BUSINESS.supportEmail}
          href={mailtoHref(BUSINESS.supportEmail)}
        />
        <ContactLine
          icon={<Phone size={18} />}
          label="Support phone"
          value={BUSINESS.supportPhone}
          href={telHref(BUSINESS.supportPhone)}
        />
      </div>

      <LegalSection title="What to include">
        <p>
          For a refund, name the tool, the date, the amount, and any payment reference, and write
          within <MarkedText value={BUSINESS.refundWindow} /> of the charge. The paid digital service
          is Insta Reach Booster. Viral Insta Songs and Viral AI Art Trends are free. We reply by
          email or phone.
        </p>
        <p>
          Related pages:{" "}
          <Link to="/pricing" className="font-bold text-primaryPurple hover:underline">
            Pricing
          </Link>
          ,{" "}
          <Link to="/refund-policy" className="font-bold text-primaryPurple hover:underline">
            Refund & Cancellation Policy
          </Link>
          ,{" "}
          <Link to="/shipping-policy" className="font-bold text-primaryPurple hover:underline">
            Shipping & Delivery Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Business details">
        <BusinessFacts includeOwner />
      </LegalSection>
    </LegalPage>
  );
}
