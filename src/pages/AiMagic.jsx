import { Link } from "react-router-dom";
import { Camera, Images, Music, Sparkles, ArrowRight, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SiteFooter from "../components/SiteFooter";
import { PriceLabel } from "../components/BusinessFacts";
import { serviceById } from "../config/business";

const presentation = {
  insta: {
    desc: "AI-powered profile analysis to help your content go viral on Instagram.",
    icon: <Camera size={32} />,
    color: "text-primaryPurple",
    bgColor: "bg-purple-50",
    borderColor: "border-primaryPurple/20",
  },
  songs: {
    desc: "A digital report of trending audio and songs for the niche you type in.",
    icon: <Music size={32} />,
    color: "text-secondaryBlue",
    bgColor: "bg-blue-50",
    borderColor: "border-secondaryBlue/20",
  },
  art: {
    desc: "Viral AI image styles and example prompts for a theme you choose.",
    icon: <Sparkles size={32} />,
    color: "text-accentPink",
    bgColor: "bg-pink-50",
    borderColor: "border-accentPink/20",
  },
  templates: {
    desc: "Photo templates. Add your picture and a short line, then share or download the image.",
    icon: <Images size={32} />,
    color: "text-primaryPurple",
    bgColor: "bg-purple-50",
    borderColor: "border-primaryPurple/20",
  },
};

const tools = ["insta", "songs", "art", "templates"].map((id) => ({
  ...serviceById(id),
  ...presentation[id],
}));

const AiMagic = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PageHeader title="AI Magic" backTo="/" backLabel="Back to home" />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
            AI <span className="text-primaryPurple">Magic</span> Tools
          </h1>
          <p className="mx-auto max-w-2xl font-medium text-gray-500">
            Viral Insta Songs, Viral AI Art Trends, and Viral Templates are free. Insta Reach Booster is a paid
            digital profile score. Every result is shown on this website. Nothing is shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`group relative overflow-hidden rounded-[2.5rem] border-2 p-8 transition-all hover:shadow-2xl hover:shadow-purple-100 ${tool.borderColor} ${tool.bgColor}`}
            >
              <div className="absolute right-6 top-6 flex gap-2">
                <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-600 shadow-sm">
                  Available
                </span>
                <span
                  className={`rounded-full border border-gray-100 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    tool.paid ? "text-primaryPurple" : "text-green-600"
                  }`}
                >
                  {tool.paid ? "Paid" : "Free"}
                </span>
              </div>

              <div className={`${tool.color} mb-6 inline-block rounded-2xl bg-white p-4 shadow-sm`}>
                {tool.icon}
              </div>

              <h3 className="mb-3 text-2xl font-black tracking-tight text-gray-900">{tool.name}</h3>
              <p className="mb-2 text-sm leading-relaxed text-gray-600">{tool.desc}</p>
              <p className="mb-8 text-sm font-black text-gray-800">
                <PriceLabel price={tool.price} />
              </p>

              <Link
                to={tool.route}
                className="flex items-center text-sm font-bold text-primaryPurple hover:underline"
              >
                Try Now <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-[3rem] bg-gradient-to-r from-primaryPurple to-secondaryBlue p-8 text-center text-white sm:p-10">
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-black">Free tools and paid reports</h2>
            <p className="mb-8 font-medium opacity-90">
              The prompt library, Viral Insta Songs, Viral AI Art Trends, and Viral Templates are free. Insta Reach
              Booster is a paid digital scan. A spent cap says: Limit reached, try tomorrow.
            </p>
            <Link
              to="/pricing"
              className="inline-block rounded-2xl bg-white px-8 py-4 font-black text-primaryPurple shadow-xl transition-all hover:scale-105"
            >
              VIEW PRICING
            </Link>
          </div>
          <Zap className="absolute -bottom-10 -right-10 text-white/10" size={200} />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AiMagic;
