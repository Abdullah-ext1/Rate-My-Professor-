import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const AnnouncementScreen = ({ onNavClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Important');
  
  // Mock current user role for testing UI (can be 'user', 'moderator', or 'admin')
  const currentUserRole = 'admin'; 

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'End Semester Exams Schedule',
      content: 'The timetable for the upcoming end semester examinations has been uploaded. Exams will commence from April 14th. Please check the college portal for detailed subject-wise breakdown.',
      author: 'Examination Cell',
      date: 'Today, 9:00 AM',
      type: 'Important',
    },
    {
      id: 2,
      title: 'Tech Fest 2026 Registration Open',
      content: 'Registrations for the annual Tech Fest are now officially open! Participate in coding challenges, hackathons, and gaming tournaments. Early bird registration ends this Friday.',
      author: 'Student Council',
      date: 'Yesterday, 2:30 PM',
      type: 'Event',
    },
    {
      id: 3,
      title: 'Library Maintenance Notice',
      content: 'The central library will remain closed this Saturday from 10:00 AM to 4:00 PM for system maintenance and catalog updates.',
      author: 'Chief Librarian',
      date: 'April 2nd, 11:15 AM',
      type: 'General',
    }
  ]);

  const handleCreate = () => {
    if (!title || !content) return;
    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      author: currentUserRole === 'admin' ? 'Admin' : 'Moderator',
      date: 'Just now',
      type
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'Important': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Event': return 'bg-accent-teal/10 text-accent-teal border-accent-teal/20';
      default: return 'bg-primary-mid/10 text-primary-mid border-primary-mid/20';
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold text-text font-syne tracking-tight">
            campus<span className="text-primary-mid">.</span>
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">
            Announcements
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-hide bg-bg pt-16">
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-bg2 border border-border rounded-2xl p-4 shadow-sm hover:border-border2 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getTypeStyle(announcement.type)}`}>
                  {announcement.type}
                </span>
                <span className="text-xs text-text3 font-medium">{announcement.date}</span>
              </div>
              <h3 className="text-sm font-bold text-text mb-1.5">{announcement.title}</h3>
              <p className="text-xs text-text2 leading-relaxed mb-3">{announcement.content}</p>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary-mid/20 flex items-center justify-center text-[10px] font-bold text-primary-mid">
                    {announcement.author.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-text3">{announcement.author}</span>
                </div>
                {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                  <button 
                    onClick={() => setDeleteId(announcement.id)}
                    className="text-xs text-red-500/70 hover:text-red-500 font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for Mod/Admin */}
      {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="fixed bottom-20 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer hover:bg-primary-dark transition-transform hover:scale-105 z-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity" onClick={() => setIsModalOpen(false)}>
          <div className="bg-bg w-full sm:w-[400px] p-5 rounded-t-3xl sm:rounded-3xl border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-text font-syne">Create Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text3 hover:text-text cursor-pointer bg-bg2 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid" 
                />
              </div>
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">Content</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows="4"
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid resize-none" 
                />
              </div>
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid appearance-none cursor-pointer"
                >
                  <option>Important</option>
                  <option>Event</option>
                  <option>General</option>
                </select>
              </div>
              <button 
                onClick={handleCreate}
                className="w-full mt-2 bg-primary text-white rounded-xl py-3 text-sm font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
              >
                Post Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => setAnnouncements(announcements.filter(a => a.id !== deleteId))}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
      />
    </div>
  );
};

export default AnnouncementScreen;