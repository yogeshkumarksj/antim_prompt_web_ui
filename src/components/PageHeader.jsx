import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ title, backTo = "/", backLabel = "Back" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gridBorder bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        <Link
          to={backTo}
          aria-label={backLabel}
          className="rounded-full p-2 transition-all hover:bg-gray-100"
        >
          <ArrowLeft size={24} className="text-primaryPurple" />
        </Link>
        <h1 className="ml-2 truncate text-lg font-bold text-gray-800 sm:ml-4 sm:text-xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
