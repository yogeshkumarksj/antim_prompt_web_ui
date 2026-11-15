import { Link } from "react-router-dom";
import { APP_NAME } from "../constants";

const LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund-policy", label: "Refund & Cancellation Policy" },
  { to: "/shipping-policy", label: "Shipping & Delivery Policy" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gridBorder bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-black text-primaryPurple tracking-tight">{APP_NAME}</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500">
              Some features are free. Paid features are digital services delivered on this
              website. We do not ship physical goods.
            </p>
          </div>
          <p className="text-sm text-gray-400">© 2026 {APP_NAME}</p>
        </div>
        <nav aria-label="Policies and company" className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs font-bold text-secondaryBlue hover:text-primaryPurple"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
