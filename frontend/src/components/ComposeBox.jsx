import React, { useState } from 'react';

const ComposeBox = ({ onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('confession');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handlePost = () => {
    if (content.trim() || title.trim()) {
      onPost(title, content, category);
      setTitle('');
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className={`bg-bg2 border border-border rounded-3xl p-3 transition-all ${isExpanded ? 'shadow-lg' : ''}`}>
      <div className="flex gap-2">
        <div className="w-7 h-7 rounded-full bg-opacity-20 bg-primary border border-opacity-30 border-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">👻</div>
        
        {!isExpanded ? (
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-xs bg-bg3 border border-border2 rounded-2xl px-3 py-2 cursor-text text-text3 hover:border-border transition-colors"
          >
            Post anonymously...
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2.5 bg-bg3 border border-border2 rounded-2xl p-2.5">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="text-sm font-semibold text-text bg-transparent border-none focus:outline-none placeholder:text-text3"
              autoFocus
            />
            <hr className="border-border2" />
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's down there?"
              rows={3}
              className="text-xs text-text bg-transparent border-none focus:outline-none placeholder:text-text3 resize-none w-full" 
            />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3 mt-3 ml-9">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {['confession', 'question', 'rant', 'attendance'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors capitalize whitespace-nowrap ${
                  category === cat 
                    ? 'bg-opacity-20 bg-primary border-opacity-50 border-primary text-primary-mid font-medium' 
                    : 'bg-transparent border-border2 text-text3 hover:bg-bg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-xs text-text3 hover:text-text px-3 py-1.5 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handlePost} 
              className="bg-primary text-white rounded-2xl px-4 py-1.5 text-xs font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComposeBox;
