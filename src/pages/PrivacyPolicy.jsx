import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../components/LegalPage";
import BusinessFacts from "../components/BusinessFacts";
import { BUSINESS } from "../config/business";

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" kicker={BUSINESS.brandName}>
      <LegalSection title="1. Who we are">
        <p>
          This policy explains how <strong>{BUSINESS.legalName}</strong> ("we") handles information
          when you use {BUSINESS.brandName}, also called {BUSINESS.productName}, at{" "}
          {BUSINESS.websiteLabel}. The site is part of {BUSINESS.groupName}. It offers a free prompt
          library and digital AI tools. Some of those tools are paid. We do not sell physical goods.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect only what the feature you use needs:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Search words and the prompts you open, copy, or share, stored as anonymous counts.</li>
          <li>The Instagram username you type into Insta Reach Booster.</li>
          <li>The niche or theme you type into Viral Insta Songs or Viral AI Art Trends.</li>
          <li>
            Details you send us yourself, such as your name, email, or phone, when you write to
            support.
          </li>
          <li>
            Saved prompts, which stay in this browser's local storage. We do not upload that private
            library.
          </li>
          <li>Basic technical logs, such as browser type and the time of a request, used to run and protect the site.</li>
          <li>
            If you pay for a digital service, our payment gateway shares the payment status, amount,
            and a transaction reference. We do not receive or store your full card number, CVV, or
            UPI PIN.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use it">
        <p>
          We use this information to show prompts, generate the AI report you asked for, enforce the
          daily cap on AI tools, reply to you, prevent abuse, and understand which prompts are
          useful. We do not sell personal information.
        </p>
      </LegalSection>

      <LegalSection title="4. Who we share it with">
        <p>We share data with service providers only so the site can function:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>The host that runs this website and the API.</li>
          <li>The database that stores the public prompt catalogue.</li>
          <li>An AI provider that writes the text of a report from the details you submitted.</li>
          <li>An Instagram data source, only when you ask for a profile score.</li>
          <li>A payment gateway, only when you pay for a digital service.</li>
        </ul>
        <p>
          Those providers process data under their own terms. We do not control Instagram, Meta, or
          the AI provider.
        </p>
      </LegalSection>

      <LegalSection title="5. Local storage">
        <p>
          Saved prompts and the admin session key (if you use the private admin page) stay in this
          browser. Clearing site data removes them. The admin key is not written into the public
          website code.
        </p>
      </LegalSection>

      <LegalSection title="6. How long we keep it">
        <p>
          Prompt view and copy counts stay as aggregate statistics. Messages you send us are kept
          until the request is resolved, then deleted when we no longer need them. A short log of AI
          requests may be kept so we can apply the daily limit and fix failures. You can ask us to
          delete contact details we hold about you.
        </p>
      </LegalSection>

      <LegalSection title="7. Children">
        <p>
          This website is not directed at anyone under 18. We do not knowingly collect their
          personal information. If you believe a minor's information reached us, contact us and we
          will delete it.
        </p>
      </LegalSection>

      <LegalSection title="8. Your choices">
        <p>
          You can stop using the tools at any time, clear local storage, and ask us to correct or
          delete information you sent us. Write to the email on the{" "}
          <Link to="/contact" className="font-bold text-primaryPurple hover:underline">
            Contact Us
          </Link>{" "}
          page. We may need to keep a record where the law requires it, for example a paid
          transaction.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          The public site is served over HTTPS. No method of transmission is perfectly secure. Do
          not send passwords or card details by email.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We will post updates on this page and change the date above. Continued use of the site
          after an update means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p className="mb-4">Questions about this policy can be sent using the details below.</p>
        <BusinessFacts />
      </LegalSection>
    </LegalPage>
  );
}
