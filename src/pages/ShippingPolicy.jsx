import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { BUSINESS } from "../config/business";

export default function ShippingPolicy() {
  return (
    <LegalPage title="Shipping & Delivery Policy" kicker={BUSINESS.brandName}>
      <LegalSection title="1. No physical shipping">
        <p>
          <strong>{BUSINESS.legalName}</strong> does not sell or ship physical products through{" "}
          {BUSINESS.brandName}. There are no courier partners, shipping charges, delivery
          addresses, or shipping zones. You do not need to provide a postal address to use a tool.
        </p>
      </LegalSection>

      <LegalSection title="2. Digital delivery">
        <p>Every service is delivered on this website:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Prompt Library: prompts are shown on the page as soon as they load.</li>
          <li>Insta Reach Booster: the score and notes appear on the audit page when the scan finishes.</li>
          <li>
            Viral Insta Songs and Viral AI Art Trends: the report appears on that tool's page when
            generation finishes. The page shows a loading state while it is working.
          </li>
        </ul>
        <p>
          Delivery is online and is available wherever the website loads. A successful delivery is
          the report or prompt visible on your screen. We do not email a parcel tracking number
          because nothing is shipped.
        </p>
      </LegalSection>

      <LegalSection title="3. Timing">
        <p>
          Digital delivery is usually immediate and depends on your connection and on the AI
          provider. If generation is still running, leave the loading state on the page. Refreshing
          may start a new request and can count toward the daily cap.
        </p>
      </LegalSection>

      <LegalSection title="4. If delivery fails">
        <p>
          If the page shows an error, the report was not delivered. You can try again. If you were
          charged and still received no usable report, use the{" "}
          <Link to="/refund-policy" className="font-bold text-primaryPurple hover:underline">
            Refund & Cancellation Policy
          </Link>
          .
        </p>
        <p>
          "Limit reached, try tomorrow." means today's allowance is used. It is not a lost
          shipment. Access to that tool returns the next day.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact">
        <p className="mb-4">
          Questions about a digital delivery can be sent to the business below. There is no
          warehouse or returns desk.
        </p>
        <BusinessFacts />
      </LegalSection>
    </LegalPage>
  );
}
