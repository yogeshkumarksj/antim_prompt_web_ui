import React from 'react';
import { Eye } from 'lucide-react';

const cardImageSrc = (prompt) =>
  prompt.thumbnail_url || prompt.card_image_url || prompt.image_url;

const PromptCard = ({ prompt }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gridBorder overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={cardImageSrc(prompt)} 
          alt={prompt.title} 
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ aspectRatio: '1 / 1' }}
        />
      </div>
      
      <div className="p-3 md:p-4">
        <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">{prompt.title}</h3>
        
        <div className="flex justify-between items-center">
          <span className="text-accentPink text-[10px] font-extrabold uppercase tracking-wider">
            #{prompt.category}
          </span>
          
          <div className="flex items-center text-secondaryBlue text-xs font-semibold">
            <Eye size={14} className="mr-1" />
            {prompt.views}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
