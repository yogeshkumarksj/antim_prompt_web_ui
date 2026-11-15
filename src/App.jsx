import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './constants';
import logo from './assets/logo.png';
import PromptCard from './components/PromptCard';
import { Search, Heart, Zap } from 'lucide-react';
import SiteFooter from './components/SiteFooter';

const PromptDetail = lazy(() => import('./pages/PromptDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Saved = lazy(() => import('./pages/Saved'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AiMagic = lazy(() => import('./pages/AiMagic'));
const InstaAudit = lazy(() => import('./pages/InstaAudit'));
const ViralSongs = lazy(() => import('./pages/ViralSongs'));
const ArtTrends = lazy(() => import('./pages/ArtTrends'));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
      Loading...
    </div>
  );
}

function Home() {
  const [prompts, setPrompts] = React.useState([]);
  const [categories, setCategories] = React.useState(["All"]);
  const [selectedCat, setSelectedCat] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/prompts/`;
      const params = new URLSearchParams();
      
      if (selectedCat && selectedCat !== "All") {
        params.append("category", selectedCat);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const res = await axios.get(finalUrl);
      setPrompts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [selectedCat, searchQuery]);

  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/categories/`);
        setCategories(["All", ...res.data.map(c => c.name)]);
      } catch (err) { console.error(err); }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gridBorder z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Antim Prompt" className="h-8 sm:h-10 md:h-12 w-auto" width={48} height={48} decoding="async" />
            <span className="ml-2 text-base sm:text-lg md:text-2xl font-black text-primaryPurple tracking-tighter">
              Antim Prompt
            </span>
          </Link>

          <div className="order-3 w-full sm:order-none sm:flex-1 sm:max-w-2xl flex items-center bg-gray-100 px-3 py-2 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Link
              to="/ai-magic"
              className="flex items-center text-gray-600 font-bold hover:text-primaryPurple transition-all mr-4"
            >
              <Zap size={20} className="mr-1 fill-current text-primaryPurple" />
              <span className="hidden md:inline">AI Magic</span>
            </Link>
            <Link to="/saved" className="p-2 text-gray-500 hover:text-primaryPurple transition-all">
              <Heart size={24} />
            </Link>
            <button className="hidden sm:block bg-primaryPurple text-white px-4 py-2 rounded-xl text-sm font-bold">Get App</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] w-full mx-auto px-4 py-6 overflow-x-auto flex space-x-3 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCat(cat)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCat === cat ? "bg-primaryPurple text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="max-w-[1400px] w-full mx-auto px-4 flex-1 pb-20">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading prompts...</div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No prompts found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
            {prompts.map((p) => (
              <Link key={p.id} to={`/prompt/${p.id}`} className="flex">
                <PromptCard prompt={p} />
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompt/:id" element={<PromptDetail />} />
        <Route path="/ai-magic" element={<AiMagic />} />
        <Route path="/insta-audit" element={<InstaAudit />} />
        <Route path="/viral-songs" element={<ViralSongs />} />
        <Route path="/art-trends" element={<ArtTrends />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
