import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { ArrowLeft, Copy, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { isPromptSaved, toggleSavePrompt } from '../utils/savedStorage';
import SiteFooter from '../components/SiteFooter';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // सारे Hooks हमेशा टॉप पर होने चाहिए
  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [timer, setTimer] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // प्रॉम्ट डेटा लाएं
        const res = await axios.get(`${BASE_URL}/prompts/`);
        const data = res.data.find(p => p.id === parseInt(id));
        setPrompt(data);
        setIsSaved(isPromptSaved(parseInt(id)));
        
        // व्यू काउंट बढ़ाएं
        axios.post(`${BASE_URL}/prompts/${id}/increment/view`);

        // सेटिंग्स चेक करें
        const settings = await axios.get(`${BASE_URL}/settings`);
        if (settings.data.timer_enabled !== 'true') {
          setShowPrompt(true);
        } else {
          setTimer(parseInt(settings.data.timer_seconds || "5"));
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const startTimer = () => {
    setIsRunning(true);
    let count = timer;
    const interval = setInterval(() => {
      count -= 1;
      setTimer(count);
      if (count <= 0) {
        clearInterval(interval);
        setShowPrompt(true);
        setIsRunning(false);
      }
    }, 1000);
  };

  const handleSave = () => {
    const status = toggleSavePrompt(prompt);
    setIsSaved(status);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt_text);
      axios.post(`${BASE_URL}/prompts/${id}/increment/copy`);
      alert("Prompt copied to clipboard!");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-primaryPurple">Loading details...</div>;
  if (!prompt) return <div className="p-20 text-center">Prompt not found!</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white">
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 w-full flex-1">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primaryPurple transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Explore
        </button>
        <button onClick={handleSave} className={`p-3 rounded-xl transition-all ${isSaved ? "bg-primaryPurple text-white" : "bg-gray-100 text-gray-400"}`}>
          {isSaved ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative group">
          <img 
            src={prompt.image_url} 
            alt={prompt.title}
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="w-full rounded-3xl border-4 border-primaryPurple/10 shadow-2xl object-cover aspect-square" 
          />
        </div>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2">{prompt.title}</h1>
          <span className="text-accentPink font-bold mb-6 uppercase tracking-widest text-xs">
            #{prompt.category}
          </span>

          {!showPrompt ? (
            <div className="text-center p-10 bg-promptBox rounded-3xl border-2 border-dashed border-gridBorder">
              {isRunning ? (
                <div className="text-3xl font-black text-primaryPurple">
                  {timer}s
                  <p className="text-xs text-gray-400 mt-2 uppercase">Generating...</p>
                </div>
              ) : (
                <button 
                  onClick={startTimer}
                  className="bg-primaryPurple text-white px-10 py-4 rounded-2xl font-bold flex items-center mx-auto hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95"
                >
                  <Zap className="mr-2 fill-current" size={20} /> GENERATE PROMPT
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="bg-promptBox p-6 rounded-2xl border border-gridBorder text-gray-700 leading-relaxed italic shadow-inner">
                {prompt.prompt_text}
              </div>
              <button 
                onClick={handleCopy}
                className="w-full bg-primaryPurple text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-opacity-90 shadow-lg shadow-purple-100 transition-all"
              >
                <Copy size={20} className="mr-2" /> COPY PROMPT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <SiteFooter />
    </div>
  );
};

export default PromptDetail;