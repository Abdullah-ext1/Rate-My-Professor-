import { useState, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [professors, setProfessors] = useState([
    {
      id: 1,
      rank: 1,
      name: 'Dr. Rahul Sharma',
      subject: 'Data Structures',
      college: 'Rizvi',
      rating: 4.8,
      reviewCount: 234,
      avatar: 'RS'
    },
    {
      id: 2,
      rank: 2,
      name: 'Prof. Priya Verma',
      subject: 'Web Development',
      college: 'SFIT',
      rating: 4.7,
      reviewCount: 198,
      avatar: 'PV'
    },
    {
      id: 3,
      rank: 3,
      name: 'Dr. Anil Kumar',
      subject: 'Database Management',
      college: 'VIT',
      rating: 4.6,
      reviewCount: 167,
      avatar: 'AK'
    },
    {
      id: 4,
      rank: 4,
      name: 'Prof. Neha Singh',
      subject: 'Algorithms',
      college: 'Saboo Siddik',
      rating: 4.5,
      reviewCount: 145,
      avatar: 'NS'
    },
    {
      id: 5,
      rank: 5,
      name: 'Dr. Vivek Patel',
      subject: 'Operating Systems',
      college: 'DJ Sanghvi',
      rating: 4.4,
      reviewCount: 132,
      avatar: 'VP'
    },
    {
      id: 6,
      rank: 6,
      name: 'Prof. Anjali Gupta',
      subject: 'Machine Learning',
      college: 'Rizvi',
      rating: 4.3,
      reviewCount: 119,
      avatar: 'AG'
    },
    {
      id: 7,
      rank: 7,
      name: 'Dr. Sanjay Bhatt',
      subject: 'Networking',
      college: 'SFIT',
      rating: 4.2,
      reviewCount: 108,
      avatar: 'SB'
    },
    {
      id: 8,
      rank: 8,
      name: 'Prof. Manisha Desai',
      subject: 'Software Engineering',
      college: 'VIT',
      rating: 4.1,
      reviewCount: 95,
      avatar: 'MD'
    },
    {
      id: 9,
      rank: 9,
      name: 'Dr. Ramesh Nair',
      subject: 'Compiler Design',
      college: 'Saboo Siddik',
      rating: 4.0,
      reviewCount: 82,
      avatar: 'RN'
    },
    {
      id: 10,
      rank: 10,
      name: 'Prof. Divya Sharma',
      subject: 'Cloud Computing',
      college: 'DJ Sanghvi',
      rating: 3.9,
      reviewCount: 71,
      avatar: 'DS'
    }
  ]);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'score-high';
    if (rating >= 3.5) return 'score-mid';
    return 'score-low';
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="app-layout">
      <ChatSidebar activeView="leaderboard" />
      <div className="main">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">⭐ Professor Leaderboard</h1>
          <p className="leaderboard-sub">Top 10 professors ranked by student ratings</p>
        </div>

        <div className="leaderboard-table">
          <div className="leaderboard-head">
            <div className="lb-rank">Rank</div>
            <div className="lb-prof">Professor</div>
            <div className="lb-subject">Subject</div>
            <div className="lb-rating">Rating</div>
            <div className="lb-reviews">Reviews</div>
          </div>

          {professors.map((prof) => (
            <div key={prof.id} className={`leaderboard-row ${getRankBadgeClass(prof.rank)}`}>
              <div className="rank-number">
                {getRankMedal(prof.rank)}
              </div>
              <div className="prof-info">
                <div className="prof-avatar">{prof.avatar}</div>
                <div className="prof-details">
                  <div className="prof-name">{prof.name}</div>
                  <div className="prof-college">{prof.college}</div>
                </div>
              </div>
              <div className="prof-subject">{prof.subject}</div>
              <div className={`rating-badge ${getRatingColor(prof.rating)}`}>
                ⭐ {prof.rating.toFixed(1)}
              </div>
              <div className="review-count">{prof.reviewCount} reviews</div>
            </div>
          ))}
        </div>

        <div className="leaderboard-tips">
          <h3 className="tip-title">💡 How Ratings Work</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">⭐</span>
              <p className="tip-text">Professors are ranked by their average rating (highest first)</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">👥</span>
              <p className="tip-text">Ratings are based on anonymous student reviews</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <p className="tip-text">Click on any professor to see their full profile and reviews</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📊</span>
              <p className="tip-text">Rating scale: 4.5+ (Excellent) | 3.5-4.4 (Good) | Below 3.5 (Needs Improvement)</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Leaderboard;
