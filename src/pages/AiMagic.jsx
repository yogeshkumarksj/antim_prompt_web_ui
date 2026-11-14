import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants';
import { Zap, Camera, Music, Sparkles, ArrowRight, X, Send } from 'lucide-react';

const AiMagic = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/waitlist/`, formData);
      alert("Awesome! We'll notify you soon.");
      setShowModal(false);
      setFormData({ full_name: '', email: '', whatsapp: '' });
    } catch (err) {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  };
  const tools = [
    {
      title: "Insta Reach Booster",
      desc: "AI-powered profile analysis to help your content go viral on Instagram.",
      icon: <Camera size={32} />,
      color: "text-primaryPurple",
      bgColor: "bg-purple-50",
      borderColor: "border-primaryPurple/20"
    },
    {
      title: "Viral Insta Songs",
      desc: "Discover trending audio and songs before they hit the mainstream.",
      icon: <Music size={32} />,
      color: "text-secondaryBlue",
      bgColor: "bg-blue-50",
      borderColor: "border-secondaryBlue/20"
    },
    {
      title: "Viral AI Art Trends",
      desc: "Stay ahead with real-time tracking of viral AI image styles and prompts.",
      icon: <Sparkles size={32} />,
      color: "text-accentPink",
      bgColor: "bg-pink-50",
      borderColor: "border-accentPink/20"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      {/* Modal / Popup Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black mb-2">Get Notified</h2>
            <p className="text-gray-500 text-sm mb-6 font-medium">Be the first to know when we launch.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.full_name}
                className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="WhatsApp Number"
                required
                value={formData.whatsapp}
                className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primaryPurple text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:shadow-xl transition-all"
              >
                {loading ? "Saving..." : <><Send size={18} className="mr-2" /> Notify Me</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            AI <span className="text-primaryPurple">Magic</span> Tools
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Unlock the power of Artificial Intelligence to boost your social media presence and stay ahead of trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className={`relative group p-8 rounded-[2.5rem] border-2 ${tool.borderColor} ${tool.bgColor} transition-all hover:shadow-2xl hover:shadow-purple-100 overflow-hidden`}
            >
              {/* Availability Badge */}
              <div className="absolute top-6 right-6 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                <span className={`text-[10px] font-black uppercase tracking-widest ${tool.title === "Insta Reach Booster" ? "text-green-600" : "text-gray-400"}`}>
                  {tool.title === "Insta Reach Booster" ? "Available" : "Coming Soon"}
                </span>
              </div>

              <div className={`${tool.color} mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm`}>
                {tool.icon}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {tool.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {tool.desc}
              </p>

              {tool.title === "Insta Reach Booster" ? (
                <Link
                  to="/insta-audit"
                  className="flex items-center text-primaryPurple font-bold text-sm hover:underline"
                >
                  Try Now <ArrowRight size={18} className="ml-2" />
                </Link>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center text-primaryPurple font-bold text-sm hover:underline"
                >
                  Notify Me <ArrowRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-r from-primaryPurple to-secondaryBlue text-white text-center relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-black mb-4">Want early access?</h2>
                <p className="mb-8 opacity-90 font-medium">Join 5,000+ creators waiting for Antim AI Magic tools.</p>
                <button className="bg-white text-primaryPurple px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                    JOIN THE WAITLIST
                </button>
            </div>
            <Zap className="absolute -bottom-10 -right-10 text-white/10" size={200} />
        </div>
      </div>
    </div>
  );
};

export default AiMagic;