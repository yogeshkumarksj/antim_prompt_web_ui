import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSavedPrompts } from '../utils/savedStorage';
import PromptCard from '../components/PromptCard';
import { ArrowLeft, Heart } from 'lucide-react';
import SiteFooter from '../components/SiteFooter';

const Saved = () => {
  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    setSavedPrompts(getSavedPrompts());
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-1">
        <header className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center text-gray-500 font-bold hover:text-primaryPurple">
            <ArrowLeft className="mr-2" /> Back to Explore
          </Link>
          <h1 className="text-2xl font-black flex items-center">
            <Heart className="mr-2 text-accentPink fill-current" /> My Library
          </h1>
        </header>

        {savedPrompts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">Your library is empty. Start saving some prompts!</p>
            <Link to="/" className="mt-4 inline-block text-primaryPurple font-bold underline">Explore Prompts</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {savedPrompts.map((p) => (
              <Link key={p.id} to={`/prompt/${p.id}`}>
                <PromptCard prompt={p} />
              </Link>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
};

export default Saved;