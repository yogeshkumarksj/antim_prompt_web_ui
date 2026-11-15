import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';
import SiteFooter from '../components/SiteFooter';
import { 
  ShieldAlert, ArrowLeft, 
  TrendingUp, CheckCircle2, AlertCircle, 
  BarChart3, User, Star, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DAILY_LIMIT_MESSAGE, interpretAiError, interpretAiResponse } from '../utils/aiFeature';

const InstaAudit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setError("");
    setResult(null);
    setLimitReached(false);

    try {
      const cleanUsername = username.replace('@', '').trim();
      const res = await axios.get(`${BASE_URL}/ai-magic/insta-audit/${encodeURIComponent(cleanUsername)}`);
      const outcome = interpretAiResponse(res);

      if (outcome.kind === "limit") setLimitReached(true);
      else if (outcome.kind === "success") setResult(outcome.data);
      else setError(outcome.message);
    } catch (err) {
      const outcome = interpretAiError(err);
      if (outcome.kind === "limit") setLimitReached(true);
      else if (!err.response) setError(outcome.message);
      else setError(outcome.message || "Failed to fetch audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gridBorder sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} className="text-primaryPurple" />
          </button>
          <h1 className="ml-4 text-xl font-bold text-gray-800">Insta Reach Booster</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-10 pb-16 w-full flex-1">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
            AI Profile <span className="text-primaryPurple">Audit</span>
          </h2>
          <p className="text-gray-500 font-medium mb-8">Enter your username to get a detailed growth report.</p>
          
          <form onSubmit={handleAudit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Instagram Username" 
                className="w-full p-4 pl-12 bg-white rounded-2xl border border-gridBorder outline-none focus:ring-2 ring-primaryPurple/20 transition-all shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primaryPurple text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? "Analyzing..." : "SCAN"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {limitReached && !loading && (
          <div role="status" className="max-w-2xl mx-auto p-5 bg-amber-50 border border-amber-200 text-amber-950 rounded-[2rem] flex gap-3">
            <Clock className="shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-lg">{DAILY_LIMIT_MESSAGE}</p>
              <p className="text-sm text-amber-900 mt-1">Today's allowance for this scan is used up. Come back tomorrow to run it again.</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div role="alert" className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center">
            <ShieldAlert className="mr-3 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Result Dashboard */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Top Row: Profile, Score, Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm flex flex-col items-center text-center">
                <img 
                  src={result.profile.profile_pic_url} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-primaryPurple/20 mb-4 object-cover"
                />
                <h3 className="font-black text-xl text-gray-900">{result.profile.full_name}</h3>
                <p className="text-gray-400 font-bold">@{result.username}</p>
                <div className="mt-4 flex gap-4 text-sm font-bold text-gray-600">
                  <span>{result.profile.followers.toLocaleString()} <br/><small className="text-gray-400 uppercase">Followers</small></span>
                  <span>{result.profile.total_posts} <br/><small className="text-gray-400 uppercase">Posts</small></span>
                </div>
              </div>

              {/* Score Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-6xl font-black text-primaryPurple z-10">{result.ai_audit.overall_score}%</div>
                <p className="font-bold text-gray-400 uppercase tracking-widest mt-2 z-10">Growth Score</p>
                <Star className="absolute -bottom-4 -right-4 text-purple-50" size={120} />
              </div>

              {/* Engagement Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-secondaryBlue">{result.engagement.average_engagement_rate}%</div>
                <p className="font-bold text-gray-400 uppercase tracking-widest mt-2">Engagement Rate</p>
                <div className="mt-4 text-xs font-bold text-blue-400 bg-blue-50 px-3 py-1 rounded-full">
                  Avg Likes: {result.engagement.average_likes}
                </div>
              </div>
            </div>

            {/* Analysis Grid: Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm">
                <h4 className="text-lg font-black mb-6 flex items-center text-green-600">
                  <CheckCircle2 className="mr-2" /> Key Strengths
                </h4>
                <div className="space-y-3">
                  {result.ai_audit.strengths.map((s, i) => (
                    <div key={i} className="p-4 bg-green-50 rounded-2xl text-sm font-bold text-green-700 border border-green-100">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm">
                <h4 className="text-lg font-black mb-6 flex items-center text-accentPink">
                  <AlertCircle className="mr-2" /> Areas to Improve
                </h4>
                <div className="space-y-3">
                  {result.ai_audit.weaknesses.map((w, i) => (
                    <div key={i} className="p-4 bg-pink-50 rounded-2xl text-sm font-bold text-pink-700 border border-pink-100">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Plan Section */}
            <div className="bg-white p-10 rounded-[3rem] border border-gridBorder shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-8 flex items-center">
                  <TrendingUp className="mr-3 text-primaryPurple" /> AI Growth Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h5 className="font-black text-gray-400 uppercase text-xs tracking-widest mb-4">Content Strategy</h5>
                    <ul className="space-y-4">
                      {result.ai_audit.content_strategy.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-purple-100 text-primaryPurple flex items-center justify-center shrink-0 mt-0.5 mr-3 text-xs font-bold">{i+1}</div>
                          <p className="text-gray-700 font-medium">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-black text-gray-400 uppercase text-xs tracking-widest mb-4">Actionable Steps</h5>
                    <ul className="space-y-4">
                      {result.ai_audit.recommendations.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-secondaryBlue mt-2 mr-3 shrink-0"></div>
                          <p className="text-gray-700 font-medium">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <BarChart3 className="absolute -bottom-10 -right-10 text-gray-50" size={250} />
            </div>

          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default InstaAudit;