import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProfessorReviewsScreen from "./ProfessorReviewsScreen";
import { ProfCardSkeleton } from "../components/Skeleton";
import ProfCard from "../components/ProfCard";
import AttendanceCard from "../components/AttendanceCard";
import AttendanceFlexCard from "../components/AttendanceFlexCard";
import api from "../context/api.js";
import { useAuth } from "../context/AuthContext";

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">
        CS dept
      </div>
    </div>
    <div
      onClick={() => onNavClick("leaderboard")}
      className="w-7 h-7 rounded-full bg-bg2 border border-border flex items-center justify-center relative cursor-pointer hover:bg-bg3 transition-colors"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9B99B0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 21h8M12 17v4M7 4h10M6 4c-1.1 0-2 .9-2 2s.9 2 2 2h0c0 4 3 7 6 7s6-3 6-7h0c1.1 0 2-.9 2-2s-.9-2-2-2H6z" />
      </svg>
    </div>
  </div>
);

const HorizontalTabs = ({ activeTab, setActiveTab }) => (
  <div className="fixed top-12 left-0 right-0 flex gap-0 border-b border-border bg-bg overflow-x-auto scrollbar-hide flex-shrink-0 px-4 z-30">
    {["Professors", "Attendance"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab.toLowerCase())}
        className={`px-3.5 py-2 text-xs cursor-pointer border-b-2 whitespace-nowrap transition-colors ${
          activeTab === tab.toLowerCase()
            ? "border-primary text-primary-mid font-medium"
            : "border-transparent text-text3 hover:text-text2"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ScrollArea = ({ children }) => (
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-24">
    {children}
  </div>
);

const SearchBar = () => (
  <div className="flex items-center gap-2 bg-bg2 border border-border rounded-2.5 px-3 py-2 mb-1">
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-text3"
    >
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3 3" />
    </svg>
    <input
      placeholder="Search professor..."
      className="flex-1 bg-transparent border-none text-xs text-text placeholder-text3 outline-none"
    />
  </div>
);

const getGrade = (p) => {
  if (p >= 90) return { label: 'GOAT 🐐', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)' };
  if (p >= 75) return { label: 'Consistent 🔥', color: '#1D9E75', bg: 'rgba(29,158,117,0.1)' };
  if (p >= 60) return { label: 'Risky 😬', color: '#EF9F27', bg: 'rgba(239,159,39,0.1)' };
  return { label: 'Danger Zone 💀', color: '#E24B4A', bg: 'rgba(226,75,74,0.1)' };
};

const ShareModal = ({ isOpen, onClose, onShare, subjects }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center transition-opacity" onClick={onClose}>
      <div 
        className="bg-gradient-to-b from-[#1a1930] to-[#0E0D14] w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 border border-primary/15 shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border2 rounded-full mx-auto mb-5 sm:hidden" />
        
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-accent-teal/15 border border-accent-teal/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-text font-syne">Flex in Global Chat</h3>
            <p className="text-xs text-text3 mt-0.5">Show off your attendance stats 💪</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-full bg-bg3 flex items-center justify-center hover:bg-bg4 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E5C72" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-5">
          <span className="text-[10px] text-text3 uppercase tracking-widest font-semibold mb-2 block ml-1">Preview</span>
          <AttendanceFlexCard subjects={subjects} compact />
        </div>

        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl bg-accent-teal/8 border border-accent-teal/15">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="text-[11px] text-accent-teal">Your stats will be shared anonymously in Global Chat</span>
        </div>

        <button 
          onClick={onShare}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-teal to-[#15B886] text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-accent-teal/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          Send to Global Chat 💬
        </button>
      </div>
    </div>
  );
};

const ProfessorsScreen = ({ onNavClick }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("professors");
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    subject: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [professors, setProfessors] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const profsRes = await api.get("/professor", { withCredentials: true })
      const mapped = profsRes.data.data.map((prof) => ({
        id: prof._id,
        name: prof.name,
        initials: prof.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        subject: prof.subjects.join(", "),
        department: prof.department,
        rating: prof.averageRating || 0,
        reviews: prof.totalReviews || 0,
        tags: [],
      }))
      setProfessors(mapped)

      const attRes = await api.get("/attendance", { withCredentials: true })
      const mappedAtt = attRes.data.data.map((att) => {
        const percent = att.totalClasses > 0 ? Math.round((att.classAttended / att.totalClasses) * 100) : 0
        const status = percent < 75 ? "danger" : percent < 80 ? "warn" : "safe"
        return {
          id: att._id,
          subject: att.subject,
          prof: att.professor?.name || "Unknown",
          attended: att.classAttended,
          total: att.totalClasses,
          percent,
          status,
          canBunk: att.bunkmeter > 0 ? att.bunkmeter.toString() : "Cannot bunk",
        }
      })
      setAttendances(mappedAtt)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, []); 

  const [bulkEditModal, setBulkEditModal] = useState({
    isOpen: false,
    id: null,
    attended: 0,
    total: 0,
  });
  
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAttendanceChange = async (id, action) => {
    if (action === "bulk") {
      const record = attendances.find((r) => r.id === id);
      if (record)
        setBulkEditModal({
          isOpen: true,
          id,
          attended: record.attended,
          total: record.total,
        });
      return;
    }
    
    if (action === "flex") {
      const record = attendances.find((r) => r.id === id);
      if (!record) return;
      try {
        const canBunkDetails = record.total > 0 && record.percent >= 75 ? `I can bunk ${record.canBunk} more classes!` : "I am in the danger zone! 💀";
        const flexMsg = `📊 Flexing my Attendance for ${record.subject}! ${canBunkDetails} (Attendance: ${record.percent}%)`;
        await api.post('/messages', { content: flexMsg });
        showToast(`💬 ${record.subject} flexed to Global Chat!`);
      } catch (err) {
        showToast('Failed to share.');
      }
      return;
    }

    try {
      await api.patch(`/attendance/${id}`, {
        attended: action === "attend",
      });

      setAttendances((prev) =>
        prev.map((record) => {
          if (record.id === id) {
            if (action === "attend") {
              return {
                ...record,
                attended: record.attended + 1,
                total: record.total + 1,
              };
            } else if (action === "bunk") {
              return { ...record, total: record.total + 1 };
            }
          }
          return record;
        }),
      );
    } catch (error) {
      console.error("Error marking attendance", error);
    }
  };

  const saveBulkEdit = async () => {
    if (bulkEditModal.id) {
      try {
        await api.put(`/attendance/${bulkEditModal.id}`, {
          lecturesAttended: parseInt(bulkEditModal.attended) || 0,
          totalLectures: parseInt(bulkEditModal.total) || 0,
        });

        setAttendances((prev) =>
          prev.map((record) => {
            if (record.id === bulkEditModal.id) {
              return {
                ...record,
                attended: parseInt(bulkEditModal.attended) || 0,
                total: parseInt(bulkEditModal.total) || 0,
              };
            }
            return record;
          }),
        );
      } catch (error) {
        console.error("Error updating bulk attendance", error);
      }
    }
    setBulkEditModal({ isOpen: false, id: null, attended: 0, total: 0 });
  };

  const handleAddProfessor = async () => {
    if (newProfessor.name) {
      const nameParts = newProfessor.name.split(" ");
      const initials =
        nameParts.length > 1
          ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
          : nameParts[0].substring(0, 2);

      try {
        const response = await api.post("/professor", {
          name: newProfessor.name,
          department: newProfessor.department,
          subjects: newProfessor.subject.split(",").map(s => s.trim()),
          tags: []
        }, { withCredentials: true });

        const createdItem = response.data.data.prof;
        
        const newProf = {
          id: createdItem._id,
          initials: initials.toUpperCase(),
          name: createdItem.name,
          subject: createdItem.subjects.join(", "),
          rating: 0,
          reviews: 0,
          tags: [],
          department: createdItem.department,
        };

        setProfessors([...professors, newProf]);
        setShowAddModal(false);
        setNewProfessor({ name: "", subject: "", department: "" });
      } catch (error) {
        console.error("Error adding professor:", error);
      }
    }
  };

  const [showAddAttendanceModal, setShowAddAttendanceModal] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    professorId: "",
    subject: "",
  });

  const handleAddAttendance = async () => {
    if (newAttendance.professorId && newAttendance.subject) {
      try {
        const res = await api.post("/attendance", {
          professor: newAttendance.professorId,
          subject: newAttendance.subject,
        });
        const att = res.data.data;
        const newRecord = {
          id: att._id,
          subject: att.subject,
          prof: professors.find(p => p.id === att.professor)?.name || "Unknown",
          attended: 0,
          total: 0,
          percent: 0,
          status: "danger",
          canBunk: "0",
        };
        setAttendances([...attendances, newRecord]);
        setShowAddAttendanceModal(false);
        setNewAttendance({ professorId: "", subject: "" });
      } catch (error) {
        console.error("Error adding attendance subject", error);
      }
    }
  };

  const handleRemoveProfessor = (id) => {
    setProfessors((prev) => prev.filter((p) => p.id !== id));
  };

  // Sort them by rating highest to lowest
  const sortedProfessors = [...professors].sort((a, b) => b.rating - a.rating);

  const currentUserRole = user?.role || "student";

  if (selectedProfessor) {
    const prof = professors.find((p) => p.id === selectedProfessor);
    return (
      <ProfessorReviewsScreen
        professor={prof}
        onBack={() => setSelectedProfessor(null)}
        currentUserRole={currentUserRole}
        onDelete={() => {
          handleRemoveProfessor(prof.id);
          setSelectedProfessor(null);
        }}
      />
    );
  }

  const totalAttended = attendances.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendances.reduce((acc, curr) => acc + curr.total, 0);
  const overallBunkable = totalClasses > 0 ? Math.floor((totalAttended * 100) / 75) - totalClasses : 0;

  const handleShare = async () => {
    try {
      const overallResult = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
      const gradeLabel = getGrade(overallResult);
      const flexMessage = `📊 My attendance stats: ${overallResult}% overall across ${attendances.length} subjects! ${gradeLabel.label}`;

      await api.post('/messages', { content: flexMessage });
      
      showToast('💬 Stats flexed to Global Chat!');
      setTimeout(() => onNavClick('chat'), 1000);
    } catch (err) {
      console.error(err);
      showToast('Failed to share.');
    }
    setShareModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-[200] bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light px-4 py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <TopNav onNavClick={onNavClick} />
      <HorizontalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollArea>
        {activeTab === "professors" ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <SearchBar />
              {(currentUserRole === "moderator" || currentUserRole === "admin") && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary/10 text-primary-mid px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/20 transition-colors ml-2 whitespace-nowrap"
                >
                  + Add Prof
                </button>
              )}
            </div>
            {isLoading ? (
              <>
                <ProfCardSkeleton />
                <ProfCardSkeleton />
                <ProfCardSkeleton />
              </>
            ) : (
              sortedProfessors.map((prof, idx) => (
                <ProfCard
                  key={prof.name}
                  rank={idx + 1}
                  initials={prof.initials}
                  name={prof.name}
                  subject={prof.subject}
                  rating={prof.rating.toFixed(1)}
                  reviews={prof.reviews}
                  tags={prof.tags}
                  onReviewsClick={() => setSelectedProfessor(prof.id)}
                  onRateClick={() => onNavClick('rate-professor', prof)}
                />
              ))
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <SearchBar />
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => setShowAddAttendanceModal(true)}
                  className="bg-primary/10 text-primary-mid px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  + Track Class
                </button>
              </div>
            </div>
            
            <div className="bg-opacity-12 bg-primary border border-opacity-20 border-primary rounded-3xl px-3.5 py-3 flex gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-2.5 bg-opacity-30 bg-primary flex items-center justify-center flex-shrink-0">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#AFA9EC"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 5v3l2 2" />
                </svg>
              </div>
              <div>
                <div className={`text-xs font-medium ${overallBunkable > 0 ? "text-primary-mid" : "text-red-400"}`}>
                  {overallBunkable > 0 
                    ? `You can bunk ${overallBunkable} more classes` 
                    : "You cannot bunk any more classes"}
                </div>
                <div className="text-xs text-text3 mt-0.5">
                  across all subjects this semester
                </div>
              </div>
            </div>
            {isLoading ? (
              <>
                <ProfCardSkeleton />
                <ProfCardSkeleton />
                <ProfCardSkeleton />
              </>
            ) : attendances.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-10 py-10 bg-bg2 rounded-3xl border border-border border-dashed text-text3 px-6 text-center">
                <span className="text-4xl mb-3 block">🧐</span>
                <h3 className="text-text font-bold mb-1">No Classes Tracked</h3>
                <p className="text-xs mb-4">You aren't tracking attendance for any subjects yet.</p>
                <button 
                  onClick={() => setShowAddAttendanceModal(true)}
                  className="px-4 py-2 bg-primary/10 text-primary-mid rounded-xl font-semibold text-xs hover:bg-primary/20 transition-colors"
                >
                  Track an ongoing class now
                </button>
              </div>
            ) : (
              attendances.map((record) => {
                const percent =
                  record.total > 0
                    ? Math.round((record.attended / record.total) * 100)
                    : 0;
                let status = "safe";
                let canBunk = "0";
                if (percent < 75) status = "danger";
                else if (percent < 80) status = "warn";

                if (percent >= 75) {
                  // calculate how many to bunk to hit 75
                  const bunkable =
                    Math.floor((record.attended * 100) / 75) - record.total;
                  canBunk = bunkable > 0 ? bunkable.toString() : "Cannot bunk";
                } else {
                  canBunk = "Cannot bunk";
                }

                return (
                  <AttendanceCard
                    key={record.id}
                    status={status}
                    subject={record.subject}
                    prof={record.prof}
                    percent={percent}
                    attended={record.attended}
                    total={record.total}
                    canBunk={canBunk}
                    onChange={(action) =>
                      handleAttendanceChange(record.id, action)
                    }
                  />
                );
              })
            )}
          </>
        )}
      </ScrollArea>

      {/* Add Professor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg border border-border rounded-3xl p-5 w-full max-w-sm">
            <h2 className="text-lg font-bold text-text mb-4">
              Add New Professor
            </h2>
            <div className="flex flex-col gap-3">
              <input
                value={newProfessor.name}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, name: e.target.value })
                }
                placeholder="Professor Name"
                className="bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text"
              />
              <input
                value={newProfessor.subject}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, subject: e.target.value })
                }
                placeholder="Subject / Course"
                className="bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text"
              />
              <input
                value={newProfessor.department}
                onChange={(e) =>
                  setNewProfessor({
                    ...newProfessor,
                    department: e.target.value,
                  })
                }
                placeholder="Department (e.g., CS)"
                className="bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-bg2 text-text3 font-medium hover:bg-bg3"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProfessor}
                className="flex-1 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark"
              >
                Add Professor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {bulkEditModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg w-full max-w-sm rounded-[32px] overflow-hidden border border-border flex flex-col pt-6 pb-6 px-6 animate-pop-in">
            <h2 className="text-text font-syne font-bold text-xl mb-4 text-center">
              Edit Attendance
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-text3 text-xs mb-1 block">
                  Lectures Attended
                </label>
                <input
                  type="number"
                  value={bulkEditModal.attended}
                  onChange={(e) =>
                    setBulkEditModal({
                      ...bulkEditModal,
                      attended: e.target.value,
                    })
                  }
                  className="w-full bg-bg2 border border-border2 focus:border-primary px-3 py-2 rounded-xl text-text text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-text3 text-xs mb-1 block">
                  Total Lectures
                </label>
                <input
                  type="number"
                  value={bulkEditModal.total}
                  onChange={(e) =>
                    setBulkEditModal({
                      ...bulkEditModal,
                      total: e.target.value,
                    })
                  }
                  className="w-full bg-bg2 border border-border2 focus:border-primary px-3 py-2 rounded-xl text-text text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  setBulkEditModal({
                    isOpen: false,
                    id: null,
                    attended: 0,
                    total: 0,
                  })
                }
                className="flex-1 py-3 text-sm font-semibold text-text border border-border rounded-2xl hover:bg-bg2 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveBulkEdit}
                className="flex-1 py-3 text-sm font-semibold bg-primary text-white border border-primary rounded-2xl hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Attendance Modal */}
      {showAddAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg border border-border rounded-3xl p-5 w-full max-w-sm">
            <h2 className="text-lg font-bold text-text mb-4">
              Track New Class
            </h2>
            <div className="flex flex-col gap-3">
              <select
                value={newAttendance.professorId}
                onChange={(e) =>
                  setNewAttendance({ ...newAttendance, professorId: e.target.value })
                }
                className="bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary transition-colors"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled className="text-text3">
                  Select Professor
                </option>
                {professors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                value={newAttendance.subject}
                onChange={(e) =>
                  setNewAttendance({ ...newAttendance, subject: e.target.value })
                }
                placeholder="Subject Name (e.g., Data Structures)"
                className="bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddAttendanceModal(false)}
                className="flex-1 py-2 rounded-xl bg-bg2 text-text3 font-medium hover:bg-bg3 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAttendance}
                disabled={!newAttendance.professorId || !newAttendance.subject}
                className="flex-1 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
        subjects={attendances.map(a => ({ subject: a.subject, present: a.attended, total: a.total, percentage: a.percent }))}
      />
    </div>
  );
};

export default ProfessorsScreen;
