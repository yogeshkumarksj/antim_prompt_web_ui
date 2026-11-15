import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { PriceLabel } from "../components/BusinessFacts";
import { BUSINESS, SERVICES } from "../config/business";

export default function Terms() {
  const paid = SERVICES.filter((service) => service.paid);
  const free = SERVICES.filter((service) => !service.paid);

  return (
    <LegalPage title="Terms & Conditions" kicker={BUSINESS.brandName}>
      <LegalSection title="1. Agreement">
        <p>
          These terms are between you and <strong>{BUSINESS.legalName}</strong> for use of{" "}
          {BUSINESS.brandName} ({BUSINESS.productName}) at {BUSINESS.websiteLabel}. By using the
          website you agree to these terms, the{" "}
          <Link to="/privacy" className="font-bold text-primaryPurple hover:underline">
            Privacy Policy
          </Link>
          , the{" "}
          <Link to="/refund-policy" className="font-bold text-primaryPurple hover:underline">
            Refund & Cancellation Policy
          </Link>
          , and the{" "}
          <Link to="/shipping-policy" className="font-bold text-primaryPurple hover:underline">
            Shipping & Delivery Policy
          </Link>
          . If you do not agree, do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="2. What we offer">
        <p>
          {BUSINESS.brandName} is a digital service from {BUSINESS.groupName}. Some features are
          free. Some are paid. Nothing on this website is a physical product, and we do not ship
          parcels.
        </p>
        <p>
          <strong>Free:</strong> {free.map((service) => service.name).join(" and ")}.
        </p>
        <p>
          <strong>Paid digital services:</strong>{" "}
          {paid.map((service, index) => (
            <span key={service.id}>
              {index > 0 ? "; " : ""}
              {service.name} (<PriceLabel price={service.price} />)
            </span>
          ))}
          .
          The live list and prices are on the{" "}
          <Link to="/pricing" className="font-bold text-primaryPurple hover:underline">
            Pricing
          </Link>{" "}
          page. Prices are in {BUSINESS.currency}.
        </p>
      </LegalSection>

      <LegalSection title="3. Using the tools">
        <p>
          You do not need an account to browse prompts. For an AI tool, you type a username or a
          niche and the page requests a report from our server. AI tools have a usage cap. When it
          is spent, the page says "Limit reached, try tomorrow." That cap keeps the service
          available. It is not an error in your payment.
        </p>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Abuse, scrape, or overload the site or the AI tools.</li>
          <li>Submit someone else's private information, or use the tools to harass a person.</li>
          <li>Upload or request illegal content.</li>
          <li>Present an AI report as a guaranteed way to gain followers or sales.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Paid services">
        <p>
          A paid feature is a one-time digital report shown in your browser. The price is the one
          published on the Pricing page at the time you buy. When online payment is used, a payment
          gateway processes the charge. We do not store your card number, CVV, or UPI PIN. Taxes,
          including GST where {BUSINESS.gstNumber} applies, are described on the Pricing page.
        </p>
        <p>
          To buy before you pay on the site, use the{" "}
          <Link to="/contact" className="font-bold text-primaryPurple hover:underline">
            Contact Us
          </Link>{" "}
          page. Delivery and cancellation are covered in the shipping and refund policies.
        </p>
      </LegalSection>

      <LegalSection title="5. AI results">
        <p>
          Scores, song ideas, and art prompts are generated suggestions. They can be incomplete or
          wrong. They are not professional, financial, or legal advice, and they are not a promise
          that a post will go viral. Instagram is a trademark of its owner. We are not affiliated
          with Instagram or Meta.
        </p>
      </LegalSection>

      <LegalSection title="6. Your content and ours">
        <p>
          You keep the rights to text you type in. You let us use that text only to produce the
          report and to operate the service. Prompts and reports shown on the site are for your
          personal or business creative use. You may not resell the catalogue or the reports as a
          competing database. The {BUSINESS.brandName} name, logo, and site design belong to{" "}
          {BUSINESS.legalName}.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and liability">
        <p>
          The site is provided as available. Reports can fail if a username is private, a provider
          is down, or the daily cap is reached. To the extent the law allows, {BUSINESS.legalName}{" "}
          is not liable for lost followers, lost profits, or indirect damages arising from use of
          the tools. If we are liable for a paid report, that liability is limited to the amount you
          paid for that report.
        </p>
      </LegalSection>

      <LegalSection title="8. Law">
        <p>
          These terms are governed by the laws of {BUSINESS.country}. Courts in {BUSINESS.country}{" "}
          can hear disputes, without limiting any mandatory rights you have as a consumer.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes">
        <p>
          We may update these terms by posting a new version on this page. The date at the top will
          change. If you keep using the site after that, the new terms apply.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p className="mb-4">Questions about these terms:</p>
        <BusinessFacts />
      </LegalSection>
    </LegalPage>
  );
}
