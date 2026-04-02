import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ProfCard from '../components/ProfCard';
import '../styles/Professors.css';

const Professors = () => {
  const [professors, setProfessors] = useState([
    {
      id: 1,
      initials: 'VM',
      name: 'Prof. V. Mehta',
      subject: 'Database Management · SY & TY',
      score: 4.2,
      reviews: 38,
      scoreClass: 'score-high',
      pills: [
        { text: 'Lenient attendance', class: 'pill good' },
        { text: 'Clear teaching', class: 'pill good' },
        { text: 'Tough exams', class: 'pill warn' },
      ],
      review: '"Missed 12 classes and still got signed. Paper is hard though, study last 5 years PYQs."',
    },
    {
      id: 2,
      initials: 'SR',
      name: 'Prof. S. Rao',
      subject: 'Operating Systems · TY',
      score: 2.9,
      reviews: 51,
      scoreClass: 'score-mid',
      pills: [
        { text: 'Very strict attendance', class: 'pill bad' },
        { text: 'Marks internally', class: 'pill bad' },
        { text: 'Reads from slides', class: 'pill warn' },
      ],
      review: '"Never miss her class. Marks attendance 3x per lecture and will fail you in internals if she doesn\'t like you."',
    },
    {
      id: 3,
      initials: 'AP',
      name: 'Prof. A. Patil',
      subject: 'Data Structures · SY',
      score: 4.7,
      reviews: 29,
      scoreClass: 'score-high',
      pills: [
        { text: 'Best in dept', class: 'pill good' },
        { text: 'Fair marking', class: 'pill good' },
        { text: 'Helps students', class: 'pill good' },
      ],
      review: '"The only prof who actually makes you understand pointers. Legend."',
    },
  ]);

  return (
    <div className="app-layout">
      <ChatSidebar activeView="professors" />
      <div className="main">
        <div className="topbar">
          <div className="page-title">Professors</div>
          <button className="post-btn">Rate a professor</button>
        </div>

        <div className="prof-content">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total professors</div>
              <div className="stat-val">24</div>
              <div className="stat-sub">CS dept</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg rating</div>
              <div className="stat-val" style={{ color: 'var(--teal)' }}>
                3.8
              </div>
              <div className="stat-sub">out of 5</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Reviews</div>
              <div className="stat-val">312</div>
              <div className="stat-sub stat-up">+18 this week</div>
            </div>
          </div>

          <div className="search-bar">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" />
            </svg>
            <input placeholder="Search professor or subject..." />
          </div>

          {professors.map((prof) => (
            <ProfCard key={prof.id} professor={prof} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professors;
