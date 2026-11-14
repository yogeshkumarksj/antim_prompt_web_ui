import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';

// Ensure API paths are consistently built with a single trailing slash
const buildApiUrl = (path) => {
  const base = String(BASE_URL).replace(/\/+$/g, '');
  const p = String(path).replace(/^\/+|\/+$/g, '');
  return `${base}/${p}/`;
};
import { 
  Upload, Trash2, LayoutDashboard, Settings, 
  Plus, List, Eye, Copy, Share2, FolderPlus, Save, Zap 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total_prompts: 0, total_views: 0, total_copies: 0, total_shares: 0 });
  const [settings, setSettings] = useState({ timer_enabled: 'false', timer_seconds: '5' });
  
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [adminKey, setAdminKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [newCatName, setNewCatName] = useState("");

  const ADMIN_SECRET = "promptverse_admin_secret_786";

  useEffect(() => {
  if (isLoggedIn) {
    fetchAllData();
  }
}, [isLoggedIn, activeTab, filterCategory, sortBy]); // इन dependencies को जोड़ें

  const fetchAllData = async () => {
    try {
      const headers = { 'x-admin-key': ADMIN_SECRET };
      const promptsUrl = `${BASE_URL}/prompts/?category=${filterCategory === "All" ? "" : filterCategory}&sort_by=${sortBy}`;
      const [pRes, cRes, sRes, setRes] = await Promise.all([
        axios.get(promptsUrl),
        axios.get(`${BASE_URL}/categories/with-count/`),
        axios.get(`${BASE_URL}/admin/stats/`, { headers }),
        axios.get(`${BASE_URL}/settings/`)
      ]);
      setPrompts(pRes.data);
      setCategories(cRes.data);
      setStats(sRes.data);
      setSettings(setRes.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleLogin = () => {
    if (adminKey === ADMIN_SECRET) setIsLoggedIn(true);
    else alert("Invalid Admin Key!");
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!imageFile || !selectedCategory) return alert("Please fill all fields");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('prompt_text', promptText);
      formData.append('category', selectedCategory);
      formData.append('tags', tags);
      formData.append('file', imageFile);

      await axios.post(buildApiUrl('publish-prompt'), formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-admin-key': ADMIN_SECRET }
      });

      alert("Published Successfully!");
      setTitle(""); setPromptText(""); setTags(""); setImageFile(null);
      fetchAllData();
    } catch (err) { alert("Upload Failed!"); }
    setUploading(false);
  };

  const handleDeletePrompt = async (id) => {
    if (window.confirm("Delete this prompt?")) {
      await axios.delete(`${BASE_URL}/prompts/${id}`, { headers: { 'x-admin-key': ADMIN_SECRET } });
      fetchAllData();
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    await axios.post(`${BASE_URL}/categories/`, { name: newCatName }, { headers: { 'x-admin-key': ADMIN_SECRET } });
    setNewCatName("");
    fetchAllData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/prompts/${editingPrompt.id}/`, {
        title: editingPrompt.title,
        prompt_text: editingPrompt.prompt_text,
        image_url: editingPrompt.image_url,
        category: editingPrompt.category
      }, {
        headers: { 'x-admin-key': ADMIN_SECRET }
      });

      alert("Updated Successfully!");
      setShowEditModal(false);
      fetchAllData();
    } catch (err) {
      alert("Update Failed!");
    }
  };

  const updateSetting = async (key, value) => {
    await axios.post(`${BASE_URL}/settings/?key=${key}&value=${value}`, {}, { headers: { 'x-admin-key': ADMIN_SECRET } });
    fetchAllData();
    alert("Setting Updated!");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-black text-primaryPurple mb-2 text-center tracking-tighter">Antim Admin</h2>
          <p className="text-gray-400 text-center mb-8 text-sm font-medium uppercase tracking-widest">Secure Access</p>
          <input type="password" placeholder="Enter Admin Key" className="w-full p-4 bg-gray-50 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-primaryPurple transition-all" onChange={(e) => setAdminKey(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-primaryPurple text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95">Login to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gridBorder p-8 flex flex-col shrink-0">
        <h1 className="text-2xl font-black text-primaryPurple mb-12 tracking-tighter flex items-center">
          <Zap className="mr-2 fill-current" /> Antim Admin
        </h1>
        <nav className="space-y-3 flex-1">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTab === "dashboard" ? "bg-primaryPurple text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"}`}>
            <LayoutDashboard className="mr-3" size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("categories")} className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTab === "categories" ? "bg-primaryPurple text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"}`}>
            <List className="mr-3" size={20} /> Categories
          </button>
          <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTab === "settings" ? "bg-primaryPurple text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"}`}>
            <Settings className="mr-3" size={20} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Analytics Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Prompts" value={stats.total_prompts} icon={<Zap />} color="bg-purple-500" />
                <StatCard title="Total Views" value={stats.total_views} icon={<Eye />} color="bg-blue-500" />
                <StatCard title="Total Copies" value={stats.total_copies} icon={<Copy />} color="bg-green-500" />
                <StatCard title="Total Shares" value={stats.total_shares} icon={<Share2 />} color="bg-pink-500" />
              </div>

              {/* Upload Form */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm mb-12">
                <h3 className="text-xl font-black mb-6 flex items-center"><Plus className="mr-2" /> Publish New Prompt</h3>
                <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input type="text" placeholder="Title" value={title} required className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all" onChange={e => setTitle(e.target.value)} />
                    <input 
                      type="text" 
                      placeholder="Tags (e.g. anime, 4k, cinematic)" 
                      value={tags} 
                      className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all" 
                      onChange={e => setTags(e.target.value)} 
                    />
                    <select className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all" required onChange={e => setSelectedCategory(e.target.value)}>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <textarea placeholder="AI Prompt Text" value={promptText} required className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primaryPurple outline-none transition-all h-32" onChange={e => setPromptText(e.target.value)}></textarea>
                  </div>
                  <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] p-8 hover:border-primaryPurple/30 transition-all bg-gray-50/50">
                    <input type="file" id="file" hidden onChange={e => setImageFile(e.target.files[0])} />
                    <label htmlFor="file" className="cursor-pointer text-center group">
                      <div className="bg-white p-5 rounded-full shadow-md mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-primaryPurple" />
                      </div>
                      <p className="font-bold text-gray-700">{imageFile ? imageFile.name : "Choose AI Image"}</p>
                      <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">JPG, PNG or WEBP</p>
                    </label>
                  </div>
                  <button type="submit" disabled={uploading} className="lg:col-span-2 bg-primaryPurple text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-purple-100 transition-all active:scale-[0.98]">
                    {uploading ? "Uploading to Server..." : "PUBLISH TO ANTIM PROMPT"}
                  </button>
                </form>
              </div>

              {/* Manage Prompts Header & Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black text-gray-900">Manage Prompts</h2>
                
                <div className="flex items-center gap-3">
                  {/* Category Filter */}
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-3 bg-white border border-gridBorder rounded-xl text-sm font-bold outline-none focus:ring-2 ring-primaryPurple/20"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>

                  {/* Sort Filter */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-3 bg-white border border-gridBorder rounded-xl text-sm font-bold outline-none focus:ring-2 ring-primaryPurple/20"
                  >
                    <option value="newest">Newest First</option>
                    <option value="views_high">High Views</option>
                    <option value="views_low">Low Views</option>
                    <option value="copies_high">Most Copied</option>
                    <option value="shares_high">Most Shared</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto rounded-[2.5rem] border border-gridBorder bg-white shadow-sm">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-gray-50/50 border-b border-gridBorder">
                    <tr>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Image</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Title</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Stats</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {prompts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6"><img src={p.image_url} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" /></td>
                        <td className="p-6 font-bold text-gray-800">{p.title}</td>
                        <td className="p-6"><span className="bg-pink-50 text-accentPink px-3 py-1 rounded-lg text-xs font-black uppercase">{p.category}</span></td>
                        <td className="p-6 text-sm text-gray-500 font-medium">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center"><Eye size={14} className="mr-1" /> {p.views}</span>
                            <span className="flex items-center"><Copy size={14} className="mr-1" /> {p.copies}</span>
                          </div>
                        </td>
                        <td className="p-6 flex items-center">
                          <button 
                            onClick={() => { setEditingPrompt(p); setShowEditModal(true); }}
                            className="text-blue-400 hover:text-blue-600 p-2 mr-2"
                          >
                            <Settings size={20} />
                          </button>
                          <button onClick={() => handleDeletePrompt(p.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="animate-in fade-in duration-500 max-w-3xl">
              <h2 className="text-3xl font-black text-gray-900 mb-8">Manage Categories</h2>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm mb-8 flex gap-4">
                <input type="text" placeholder="New Category Name" value={newCatName} className="flex-1 p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primaryPurple" onChange={e => setNewCatName(e.target.value)} />
                <button onClick={handleAddCategory} className="bg-primaryPurple text-white px-8 rounded-2xl font-bold flex items-center"><FolderPlus className="mr-2" /> Add</button>
              </div>
              <div className="grid gap-4">
                {categories.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-2xl border border-gridBorder flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="font-black text-gray-800 text-lg">{c.name}</h4>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Total Prompts: {c.prompt_count}</p>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in duration-500 max-w-2xl">
              <h2 className="text-3xl font-black text-gray-900 mb-8">App Configuration</h2>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gridBorder shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-black text-gray-800 text-xl">Prompt Timer</h4>
                      <p className="text-gray-400 text-sm font-medium">Users must wait before seeing the prompt text</p>
                    </div>
                    <button 
                      onClick={() => updateSetting("timer_enabled", settings.timer_enabled === 'true' ? 'false' : 'true')}
                      className={`w-16 h-8 rounded-full transition-all relative ${settings.timer_enabled === 'true' ? 'bg-primaryPurple' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.timer_enabled === 'true' ? 'left-9' : 'left-1'}`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Timer Duration (Seconds)</label>
                      <input 
                        type="number" 
                        value={settings.timer_seconds} 
                        className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-primaryPurple"
                        onChange={(e) => setSettings({...settings, timer_seconds: e.target.value})}
                      />
                    </div>
                    <button onClick={() => updateSetting("timer_seconds", settings.timer_seconds)} className="bg-primaryPurple text-white p-4 rounded-2xl font-bold flex items-center"><Save className="mr-2" /> Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Edit Prompt</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" value={editingPrompt.title} className="w-full p-4 bg-gray-50 rounded-2xl border outline-none" 
                onChange={e => setEditingPrompt({...editingPrompt, title: e.target.value})} />
              
              <input 
                type="text" 
                value={editingPrompt.tags || ""} 
                placeholder="Tags"
                className="w-full p-4 bg-gray-50 rounded-2xl border outline-none"
                onChange={e => setEditingPrompt({...editingPrompt, tags: e.target.value})} 
              />


              <textarea value={editingPrompt.prompt_text} className="w-full p-4 bg-gray-50 rounded-2xl border outline-none h-32"
                onChange={e => setEditingPrompt({...editingPrompt, prompt_text: e.target.value})}></textarea>
              
              <input type="text" value={editingPrompt.image_url || ''} className="w-full p-4 bg-gray-50 rounded-2xl border outline-none"
                onChange={e => setEditingPrompt({...editingPrompt, image_url: e.target.value})} />

              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="flex-1 bg-primaryPurple text-white py-4 rounded-2xl font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gridBorder shadow-sm flex items-center">
    <div className={`${color} p-4 rounded-2xl text-white mr-5 shadow-lg shadow-gray-100`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-gray-900">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;