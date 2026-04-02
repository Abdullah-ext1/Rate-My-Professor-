import { useState } from 'react';
import '../styles/Compose.css';

const Compose = ({ onPost }) => {
  const [selectedTag, setSelectedTag] = useState('Confession');

  const handlePost = () => {
    console.log('Post with tag:', selectedTag);
  };

  return (
    <div className="compose">
      <div className="compose-row">
        <div className="compose-avatar">👻</div>
        <div className="compose-input">What's happening at Rizvi? Fully anonymous...</div>
      </div>
      <div className="tag-row">
        {['Confession', 'Question', 'Rant', 'Attendance', 'Resource'].map((tag) => (
          <button
            key={tag}
            className={`tag-chip ${selectedTag === tag ? 'selected' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Compose;
