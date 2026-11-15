import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { MarkedText } from "../components/BusinessFacts";
import { BUSINESS } from "../config/business";

export default function RefundPolicy() {
  return (
    <LegalPage title="Refund & Cancellation Policy" kicker={BUSINESS.brandName}>
      <LegalSection title="1. Scope">
        <p>
          This policy covers digital services sold by <strong>{BUSINESS.legalName}</strong> on{" "}
          {BUSINESS.websiteLabel}. Free features are not charged, so there is nothing to refund.
          We do not sell physical goods, so there is no shipment to refuse or return.
        </p>
      </LegalSection>

      <LegalSection title="2. How a paid service is delivered">
        <p>
          A paid AI report is delivered on the website, on the same page, after the request
          succeeds. Delivery is digital and usually immediate. See the{" "}
          <Link to="/shipping-policy" className="font-bold text-primaryPurple hover:underline">
            Shipping & Delivery Policy
          </Link>{" "}
          for how that works.
        </p>
      </LegalSection>

      <LegalSection title="3. Cancellation">
        <p>
          These are one-time digital reports, not a subscription, so there is no plan to cancel
          later. You can leave the page before you submit a request. Once the report has been
          generated and shown, the digital service has been delivered and cannot be cancelled.
        </p>
        <p>
          If a charge is taken and the report never appears because of a failure on our side, that
          request is treated as cancelled and is eligible for a refund under section 4.
        </p>
      </LegalSection>

      <LegalSection title="4. When we refund">
        <p>We refund a paid digital service when:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>You were charged and the report was not delivered.</li>
          <li>You were charged more than once for the same report.</li>
          <li>A technical failure made the delivered report unusable.</li>
        </ul>
        <p>We do not refund when:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>The report was delivered and you disagree with the creative suggestions.</li>
          <li>You changed your mind after the report was shown.</li>
          <li>The page showed "Limit reached, try tomorrow." The cap resets the next day, and it is not a failed delivery.</li>
          <li>The feature you used is free.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. How to ask">
        <p>
          Email <MarkedText value={BUSINESS.supportEmail} /> or call{" "}
          <MarkedText value={BUSINESS.supportPhone} /> within{" "}
          <MarkedText value={BUSINESS.refundWindow} /> of the charge. Include the tool name (Viral
          Insta Songs or Viral AI Art Trends), the date, the amount, and any payment reference.
        </p>
        <p>
          If a refund is due, we send it to the original payment method. The payment gateway or
          your bank may take additional time to show the credit. We will tell you by email once
          the refund is issued.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p className="mb-4">Refund requests go to the business below.</p>
        <BusinessFacts />
      </LegalSection>
    </LegalPage>
  );
}
