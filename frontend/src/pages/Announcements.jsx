import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import '../styles/Announcements.css';

const Announcements = () => {
  const [announcements] = useState([
    {
      id: 1,
      type: 'exam',
      title: 'Mid-Semester Exams Scheduled',
      content: 'Mid-semester examinations will be held from April 14-25. Time tables are now live on the college portal. Students must report 10 minutes before the exam.',
      author: 'Exam Cell, Rizvi',
      date: '2 hours ago',
      views: 1240,
      icon: '📝'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Google Campus Recruitment Drive',
      content: 'Google is visiting campus for recruitment on April 8. Eligible candidates: 7.5+ CGPA, no active backlogs. Registration closes April 5. Link: careers.google.com',
      author: 'Placement Cell',
      date: '4 hours ago',
      views: 2156,
      icon: '💼'
    },
    {
      id: 3,
      type: 'update',
      title: 'System Maintenance on College Portal',
      content: 'The college portal will be under maintenance on April 6 from 2 AM to 6 AM IST. During this time, attendance viewing and grade submission systems will be unavailable.',
      author: 'IT Department',
      date: '6 hours ago',
      views: 834,
      icon: '🔧'
    },
    {
      id: 4,
      type: 'event',
      title: 'Tech Conference 2024 - Register Now',
      content: 'Annual Tech Conference featuring industry leaders and hands-on workshops. April 12-13 in Central Auditorium. Free registration for students. Limited seats available!',
      author: 'Student Council',
      date: '1 day ago',
      views: 1567,
      icon: '🎉'
    },
    {
      id: 5,
      type: 'resource',
      title: 'Important: New Library Study Resources Available',
      content: 'The library has added 500+ e-books, research papers, and coding platforms. Access via your college ID. Check the library portal for complete list.',
      author: 'Library',
      date: '2 days ago',
      views: 2340,
      icon: '📚'
    },
    {
      id: 6,
      type: 'warning',
      title: 'Academic Integrity Policy Reminder',
      content: 'All students must adhere to the academic integrity policy. Plagiarism, cheating, or unauthorized collaboration will result in disciplinary action. Review policy on portal.',
      author: 'Dean of Academics',
      date: '3 days ago',
      views: 3120,
      icon: '⚠️'
    }
  ]);

  const getAnnouncementTypeLabel = (type) => {
    const labels = {
      exam: 'Exam',
      opportunity: 'Opportunity',
      update: 'Update',
      event: 'Event',
      resource: 'Resource',
      warning: 'Warning'
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr) => {
    return dateStr;
  };

  return (
    <div className="app-layout">
      <ChatSidebar activeView="announcements" />
      <div className="main">
      <div className="announcements-container">
        <div className="announcements-header">
          <h1 className="announcements-title">📢 Campus Announcements</h1>
          <p className="announcements-sub">Important updates, events, and opportunities from your college</p>
        </div>

        <div className="announcements-list">
          {announcements.map((ann) => (
            <div key={ann.id} className={`announcement-card ann-type-${ann.type}`}>
              <div className="ann-left">
                <div className="ann-type-icon">{ann.icon}</div>
              </div>
              
              <div className="ann-middle">
                <div className="ann-title">{ann.title}</div>
                <div className="ann-content">{ann.content}</div>
                <div className="ann-meta">
                  <span className="ann-type-badge">{getAnnouncementTypeLabel(ann.type)}</span>
                  <span className="ann-date">{formatDate(ann.date)}</span>
                  <span className="ann-author">from {ann.author}</span>
                </div>
              </div>

              <div className="ann-right">
                <div className="ann-views">{ann.views}</div>
                <div className="views-label">viewed</div>
              </div>
            </div>
          ))}
        </div>

        <div className="announcements-footer">
          <button className="view-more-btn">Load More Announcements</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Announcements;
