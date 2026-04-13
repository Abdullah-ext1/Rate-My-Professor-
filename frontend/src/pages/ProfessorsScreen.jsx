import { useState, useEffect } from "react";
import ProfessorReviewsScreen from "./ProfessorReviewsScreen";
import { ProfCardSkeleton } from "../components/Skeleton";
import ProfCard from "../components/ProfCard";
import AttendanceCard from "../components/AttendanceCard";
import api from "../context/api.js";

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
  <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5 scrollbar-hide bg-bg pt-20">
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

const ProfessorsScreen = ({ onNavClick }) => {
  const [activeTab, setActiveTab] = useState("professors");
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    subject: "",
    tags: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [professors, setProfessors] = useState([]);
  const [attendances, setAttendances] = useState([]);

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
        rating: 0,
        reviews: 0,
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

  const handleAttendanceChange = (id, action) => {
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
  };

  const saveBulkEdit = () => {
    if (bulkEditModal.id) {
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
    }
    setBulkEditModal({ isOpen: false, id: null, attended: 0, total: 0 });
  };

  const handleAddProfessor = () => {
    if (newProfessor.name) {
      const nameParts = newProfessor.name.split(" ");
      const initials =
        nameParts.length > 1
          ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
          : nameParts[0].substring(0, 2);
      const tagsArray = newProfessor.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const newProf = {
        id: Date.now(),
        initials: initials.toUpperCase(),
        name: newProfessor.name,
        subject: newProfessor.subject,
        rating: 0,
        reviews: 0,
        tags: tagsArray,
        department: newProfessor.department,
      };

      setProfessors([...professors, newProf]);
      setShowAddModal(false);
      setNewProfessor({ name: "", subject: "", tags: "", department: "" });
    }
  };

  const handleRemoveProfessor = (id) => {
    setProfessors((prev) => prev.filter((p) => p.id !== id));
  };

  // Sort them by rating highest to lowest
  const sortedProfessors = [...professors].sort((a, b) => b.rating - a.rating);

  const currentUserRole = "admin";

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

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav onNavClick={onNavClick} />
      <HorizontalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollArea>
        {activeTab === "professors" ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <SearchBar />
              {(currentUserRole === "admin" ||
                currentUserRole === "moderator") && (
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
                <div className="text-xs font-medium text-primary-mid">
                  You can bunk 4 more classes
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
              <input
                value={newProfessor.tags}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, tags: e.target.value })
                }
                placeholder="Tags (comma separated)"
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
    </div>
  );
};
export default ProfessorsScreen;
