import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';

const AdminScreen = ({ onNavClick, onBack }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || isAdmin;

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'moderators' | 'professors'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingProfessors, setPendingProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  // id name email role joinDate

  // Mock data for moderators
  const [moderators, setModerators] = useState([]);

  const [selectedMod, setSelectedMod] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, modId: null });

  const handleRemoveMod = () => {
    const modeRemoval = async () => {
      try {
        await api.put(`/auth/revoke-moderator/${confirmAction.modId}`);
        setModerators(prev => prev.filter(mod => mod._id !== confirmAction.modId));
        if (selectedMod?._id === confirmAction.modId) {
          setSelectedMod(null)
        }
      } catch (error) {
        console.error("Failed to revoke moderator status", error);
      } finally {
        setConfirmAction({ isOpen: false, modId: null });
      }
    }
    modeRemoval();
  };

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/pending-users'); 
      setPendingUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching pending users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingUsers();
    }
  }, [activeTab]);

  const fetchModerators = async () => {
    try {
      const res = await api.get('/auth/moderators');
      setModerators(res.data.data);
    } catch (err) {
      console.error("Error fetching moderators", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'moderators' && isAdmin) {
      fetchModerators();
    }
  }, [activeTab, isAdmin]);

  const fetchPendingProfessors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/professor?isApproved=false');
      setPendingProfessors(res.data.data);
    } catch (err) {
      console.error("Error fetching pending professors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'professors' && isAdmin) {
      fetchPendingProfessors();
    }
  }, [activeTab, isAdmin]);

  const handleApprove = async (userId) => {
    try {
      await api.put(`/auth/approve/${userId}`);
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.put(`/auth/reject/${userId}`, { reason: "Did not meet criteria." });
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleApproveProfessor = async (profId) => {
    try {
      await api.put(`/professor/${profId}/moderate`, { isApproved: true });
      setPendingProfessors(prev => prev.filter(p => p._id !== profId));
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleRejectProfessor = async (profId) => {
    try {
      await api.delete(`/professor/${profId}`);
      setPendingProfessors(prev => prev.filter(p => p._id !== profId));
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-bg h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg z-10 sticky top-0">
        <button 
          onClick={selectedMod ? () => setSelectedMod(null) : onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover active:bg-divider transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-text font-syne">
            {selectedMod ? 'Moderator Profile' : 'Admin & Moderator Dashboard'}
          </h1>
          {!selectedMod && (
            <p className="text-xs text-text3">{isAdmin ? 'Manage Moderators & Pending Users' : 'Manage Pending Users'}</p>
          )}
        </div>
      </div>

      {!selectedMod && (
        <div className="flex border-b border-border bg-bg overflow-x-auto scrollbar-hide shrink-0">
          <button 
            className={`flex-1 py-3 px-4 min-w-[max-content] text-sm font-medium ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-text3'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Users ({pendingUsers.length || 0})
          </button>
          
          {isAdmin && (
            <>
              <button 
                className={`flex-1 py-3 px-4 min-w-[max-content] text-sm font-medium ${activeTab === 'moderators' ? 'text-primary border-b-2 border-primary' : 'text-text3'}`}
                onClick={() => setActiveTab('moderators')}
              >
                Moderators ({moderators.length})
              </button>
              <button 
                className={`flex-1 py-3 px-4 min-w-[max-content] text-sm font-medium ${activeTab === 'professors' ? 'text-primary border-b-2 border-primary' : 'text-text3'}`}
                onClick={() => setActiveTab('professors')}
              >
                Professors ({pendingProfessors.length || 0})
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        {selectedMod ? (
          // Moderator Profile View
          <div className="flex flex-col items-center mt-6">
            <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-3xl font-bold text-primary mb-4 border-2 border-primary">
              {selectedMod.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-text">{selectedMod.name}</h2>
            <p className="text-text3 mb-1">{selectedMod.email}</p>
            <div className="px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 rounded-full text-xs font-semibold mt-2">
              Moderator
            </div>
            
            <div className="w-full bg-bg2 border border-border rounded-xl p-4 mt-8 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm text-text3">Joined</span>
                <span className="text-sm font-medium text-text">{timeAgo(selectedMod.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm text-text3">Actions Taken</span>
                <span className="text-sm font-medium text-text">143</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text3">Status</span>
                <span className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Active
                </span>
              </div>
            </div>

            <button 
              onClick={() => setConfirmAction({ isOpen: true, modId: selectedMod._id })}
              className="mt-8 w-full py-3.5 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-xl font-semibold text-sm hover:bg-opacity-20 transition-all flex justify-center items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              Revoke Moderator Role
            </button>
          </div>
        ) : activeTab === 'moderators' && isAdmin ? (
          // Moderators List View
          <div className="mt-4 flex flex-col gap-3">
            {moderators.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-text3 text-sm">No moderators found.</p>
              </div>
            ) : (
              moderators.map((mod) => (
                <div 
                  key={mod._id} 
                  onClick={() => setSelectedMod(mod)}
                  className="bg-bg2 border border-border rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary font-bold">
                      {mod.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text">{mod.name}</h3>
                      <p className="text-xs text-text3">{mod.email}</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="text-text3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'professors' && isAdmin ? (
          // Professors List View
          <div className="mt-4 flex flex-col gap-3 pb-8">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-text3 text-sm animate-pulse">Loading pending professors...</p>
              </div>
            ) : pendingProfessors.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <p className="text-text3 text-sm mb-2">No pending professors.</p>
                <p className="text-xs text-text3/70">All caught up! 🎉</p>
              </div>
            ) : (
              pendingProfessors.map((prof) => (
                <div 
                  key={prof._id} 
                  className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-3"
                >
                  <div>
                    <h3 className="text-sm font-bold text-text">{prof.name}</h3>
                    <p className="text-xs text-text3">Dept: {prof.department}</p>
                    <p className="text-xs text-text3">Subjects: {prof.subjects.join(', ')}</p>
                  </div>
                  <div className="flex gap-2 w-full mt-2">
                    <button 
                      onClick={() => handleRejectProfessor(prof._id)}
                      className="flex-1 py-2 text-xs font-semibold rounded-lg text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApproveProfessor(prof._id)}
                      className="flex-1 py-2 text-xs font-semibold rounded-lg text-white bg-primary-mid hover:bg-primary-light transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'pending' ? (
          // Pending Users View
          <div className="mt-4 flex flex-col gap-3 pb-8">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-text3 text-sm animate-pulse">Loading pending users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <p className="text-text3 text-sm mb-2">No pending applications.</p>
                <p className="text-xs text-text3/70">All caught up! 🎉</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <div key={user._id} className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-text">{user.name} <span className="text-xs font-normal text-text3 ml-1">@{user.username || 'unknown'}</span></h3>
                      <p className="text-xs text-text3">{user.email}</p>
                      
                      <div className="mt-2 text-xs text-text2 space-y-1">
                        <p><span className="font-semibold">College:</span> {user.college?.name || 'Unknown'}</p>
                        <p><span className="font-semibold">Dept:</span> {user.department || 'N/A'} <span className="mx-1">•</span> <span className="font-semibold">Year:</span> {user.year || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-2 pt-3 border-t border-border">
                    <button 
                      onClick={() => handleReject(user._id)}
                      className="flex-1 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(user._id)}
                      className="flex-1 py-2 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}
      </div>

      <ConfirmModal 
        isOpen={confirmAction.isOpen}
        onClose={() => setConfirmAction({ isOpen: false, modId: null })}
        onConfirm={handleRemoveMod}
        title="Revoke Moderator Role"
        message="Are you sure you want to remove this user's moderator privileges? They will be downgraded to a standard user."
        confirmText="Revoke Access"
        confirmColor="bg-red-500"
      />
    </div>
  );
};

export default AdminScreen;
