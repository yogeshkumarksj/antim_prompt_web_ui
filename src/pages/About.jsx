import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { BUSINESS, SERVICES } from "../config/business";

export default function About() {
  return (
    <LegalPage title="About Us" kicker={BUSINESS.groupName}>
      <LegalSection title="What this site is">
        <p>
          {BUSINESS.brandName}, also known as {BUSINESS.productName}, is a website from{" "}
          {BUSINESS.groupName}. It helps creators find AI image prompts and use a small set of AI
          tools for Instagram ideas. {BUSINESS.ownerName} is the owner. The site is operated by{" "}
          <strong>{BUSINESS.legalName}</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Free and paid">
        <p>
          Some features are free. Some are paid digital services. We do not sell or ship physical
          products.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          {SERVICES.map((service) => (
            <li key={service.id}>
              <Link to={service.route} className="font-bold text-primaryPurple hover:underline">
                {service.name}
              </Link>
              {" — "}
              {service.paid ? "paid digital report" : "free"}. {service.blurb}
            </li>
          ))}
        </ul>
        <p>
          Prices are on the{" "}
          <Link to="/pricing" className="font-bold text-primaryPurple hover:underline">
            Pricing
          </Link>{" "}
          page. Paid reports appear in the browser. There is no courier delivery.
        </p>
      </LegalSection>

      <LegalSection title="How the AI tools should be read">
        <p>
          A profile score, a song idea, or an art prompt is a suggestion generated for the text you
          typed. It is not a guarantee of reach, and it is not advice from Instagram. Use it as a
          starting point for your own posts.
        </p>
      </LegalSection>

      <LegalSection title="Business details">
        <p className="mb-4">
          Questions and purchase requests go to the{" "}
          <Link to="/contact" className="font-bold text-primaryPurple hover:underline">
            Contact Us
          </Link>{" "}
          page.
        </p>
        <BusinessFacts includeOwner />
      </LegalSection>
    </LegalPage>
  );
}
