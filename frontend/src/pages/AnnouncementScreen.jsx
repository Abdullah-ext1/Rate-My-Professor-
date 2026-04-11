import React, { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";
import PhoneFrame from "../components/PhoneFrame";
import { Link } from "react-router-dom";
import { AnnouncementSkeleton } from "../components/Skeleton";
import AnnouncementCard from "../components/AnnouncementCard";

const AnnouncementScreen = ({ onNavClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("Important");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user role for testing UI (can be 'user', 'moderator', or 'admin')
  const currentUserRole = "admin";

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "End Semester Exams Schedule",
      content:
        "The timetable for the upcoming end semester examinations has been uploaded. Exams will commence from April 14th. Please check the college portal for detailed subject-wise breakdown.",
      author: "Examination Cell",
      date: "Today, 9:00 AM",
      type: "Important",
    },
    {
      id: 2,
      title: "Tech Fest 2026 Registration Open",
      content:
        "Registrations for the annual Tech Fest are now officially open! Participate in coding challenges, hackathons, and gaming tournaments. Early bird registration ends this Friday.",
      author: "Student Council",
      date: "Yesterday, 2:30 PM",
      type: "Event",
    },
    {
      id: 3,
      title: "Library Maintenance Notice",
      content:
        "The central library will remain closed this Saturday from 10:00 AM to 4:00 PM for system maintenance and catalog updates.",
      author: "Chief Librarian",
      date: "April 2nd, 11:15 AM",
      type: "General",
    },
  ]);

  useEffect(() => {
    // Simulate API fetch delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeTab]); // Trigger loading when tab changes

  const filteredAnnouncements = announcements.filter((a) =>
    activeTab === "all" ? true : a.type === activeTab
  );

  const handleCreate = () => {
    if (!title || !content) return;
    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      author: currentUserRole === "admin" ? "Admin" : "Moderator",
      date: "Just now",
      type,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setIsModalOpen(false);
    setTitle("");
    setContent("");
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "Important":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Event":
        return "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
      default:
        return "bg-primary-mid/10 text-primary-mid border-primary-mid/20";
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
        {/* Tab Navigation - Uncomment if needed */}
        {/* <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md"
                : "bg-bg2 text-text"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("Important")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "Important"
                ? "bg-primary text-white shadow-md"
                : "bg-bg2 text-text"
            }`}
          >
            Important
          </button>
          <button
            onClick={() => setActiveTab("Event")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "Event"
                ? "bg-primary text-white shadow-md"
                : "bg-bg2 text-text"
            }`}
          >
            Events
          </button>
        </div> */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4">
          <div className="space-y-4">
            {isLoading ? (
              // Skeleton Loading State
              <>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
              </>
            ) : filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id}
                  announcement={announcement}
                  currentUserRole={currentUserRole}
                  onStyleType={getTypeStyle}
                  onDelete={setDeleteId}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-bg2 rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-text1 font-semibold mb-1">
                  No Announcements
                </h3>
                <p className="text-text2 text-sm">
                  You're all caught up! Check back later.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border py-3 flex justify-between items-center px-4">
          <Link
            to="/"
            className="text-primary-mid font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h4l3 10h6l3-10h4M4 10l1-2a2 2 0 012-1h10a2 2 0 012 1l1 2M4 10h16"
              />
            </svg>
            Home
          </Link>
          <Link
            to="/profile"
            className="text-primary-mid font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 4h2a2 2 0 012 2v2m-4-4h-4m4 0H8m8 0v4m0-4l-4 4m4-4l4 4m-4-4v8m0-8H8m8 0h2a2 2 0 012 2v2m-4-4h-4m4 0H8"
              />
            </svg>
            Profile
          </Link>
        </div>
      </div>

      {/* Floating Action Button for Mod/Admin */}
      {(currentUserRole === "admin" || currentUserRole === "moderator") && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer hover:bg-primary-dark transition-transform hover:scale-105 z-40"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-bg w-full sm:w-[400px] p-5 rounded-t-3xl sm:rounded-3xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-text font-syne">
                Create Announcement
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text3 hover:text-text cursor-pointer bg-bg2 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid"
                />
              </div>
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="4"
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-text3 font-medium mb-1 block">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
        onConfirm={() =>
          setAnnouncements(announcements.filter((a) => a.id !== deleteId))
        }
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
      />
    </div>
  );
};

export default AnnouncementScreen;