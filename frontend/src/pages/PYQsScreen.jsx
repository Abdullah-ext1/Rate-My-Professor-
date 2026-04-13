import { useState, useEffect } from "react";
import { PYQSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import api from "../context/api.js";

const TopNav = ({ onNavClick }) => {
  const { user } = useAuth();
  const canModerate = user?.role === 'admin' || user?.role === 'moderator';

  return (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
    <div className="flex items-center gap-2">
      <div className="text-base font-bold text-text font-syne tracking-tight">
        campus<span className="text-primary-mid">.</span>
      </div>
      <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">Vault</div>
    </div>
    
    {canModerate && (
      <button 
        onClick={() => onNavClick('moderator-dashboard')}
        className="p-1.5 bg-bg2 hover:bg-border rounded-full text-primary transition-colors border border-border flex items-center gap-1.5 px-3 cursor-pointer shadow-sm"
        title="Moderator Dashboard"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-[10px] font-bold tracking-wider uppercase">Mod</span>
      </button>
    )}
  </div>
  );
};

const SegmentedControl = ({ active, setActive }) => (
  <div className="flex bg-bg2 p-1.5 rounded-2xl mb-4 border border-border">
    {['PYQs', 'Notes'].map(opt => {
      const id = opt.toLowerCase();
      return (
        <button
          key={opt}
          onClick={() => setActive(id)}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            active === id ? 'bg-primary text-white shadow-md' : 'text-text3 hover:text-text'
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex items-center gap-2 bg-bg2 border border-border rounded-2.5 px-3 py-2 mb-3">
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text3">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3 3" />
    </svg>
    <input 
      placeholder="Search subjects..." 
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      className="flex-1 bg-transparent border-none text-xs text-text placeholder-text3 outline-none" 
    />
  </div>
);

const HorizontalTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 mb-3">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border whitespace-nowrap ${
          activeTab === tab
            ? 'bg-opacity-20 bg-primary border-opacity-50 border-primary text-primary-mid'
            : 'bg-transparent border-border2 text-text3 hover:bg-bg2'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const PYQCard = ({ subjectName, year, examType, isApproved, questionPaperUrl }) => (
  <div onClick={() => questionPaperUrl && window.open(questionPaperUrl, '_blank')} className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 flex gap-3 cursor-pointer hover:border-border2 transition-colors relative overflow-hidden group">
    <div className="w-10 h-10 rounded-2xl bg-opacity-15 bg-primary flex items-center justify-center text-primary-mid flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
      </svg>
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-sm font-semibold text-text font-syne flex items-center gap-2">
        {subjectName}
        {!isApproved && (
          <span className="px-1.5 py-0.5 rounded-sm bg-accent-amber bg-opacity-20 text-[9px] text-accent-amber font-medium uppercase tracking-wider">
            Pending
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-text3">{year}</span>
        <span className="w-1 h-1 rounded-full bg-border2"></span>
        <span className="text-xs text-text3">{examType}</span>
      </div>
    </div>
    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-opacity-20 bg-primary flex items-center justify-center text-primary-mid group-hover:bg-primary group-hover:text-white transition-colors cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </div>
  </div>
);

const UploadFloatingButton = ({ onClick }) => (
  <button onClick={onClick} className="fixed bottom-20 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer hover:bg-primary-dark transition-transform hover:scale-105 z-40">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>
);

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [type, setType] = useState('PYQ');
  const [subjectName, setSubjectName] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('End Semester');
  const [fileUrl, setFileUrl] = useState(''); // Would typically be an actual file upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!subjectName || !year || !fileUrl) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/pyqs', {
        subjectName,
        year: parseInt(year) || year,
        questionPaperUrl: fileUrl,
        examType: type === 'PYQ' ? examType : 'Notes'
      })

      if (response.data) {
        onUploadSuccess?.()
        setSubjectName('')
        setYear('')
        setFileUrl('')
        onClose()
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity" onClick={onClose}>
      <div 
        className="bg-bg w-full sm:w-[400px] p-5 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-text font-syne">Upload Resource</h2>
          <button onClick={onClose} className="text-text3 hover:text-text cursor-pointer bg-bg2 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="flex bg-bg2 p-1 rounded-xl mb-5">
          {['PYQ', 'Note'].map(opt => (
            <button
              key={opt}
              onClick={() => setType(opt)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                type === opt ? 'bg-primary text-white shadow-sm' : 'text-text3 hover:text-text'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {error && <div className="text-accent-amber text-xs font-medium p-2 bg-accent-amber/10 rounded-lg">{error}</div>}
          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Subject Name</label>
            <input 
              type="text" 
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              placeholder="e.g. Data Structures" 
              className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" 
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-text3 font-medium mb-1 block">Year</label>
              <input 
                type="number" 
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="2024" 
                className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" 
              />
            </div>
            
            {type === 'PYQ' && (
              <div className="flex-[2]">
                <label className="text-xs text-text3 font-medium mb-1 block">Exam Type</label>
                <select 
                  value={examType}
                  onChange={e => setExamType(e.target.value)}
                  className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid appearance-none cursor-pointer"
                >
                  <option>End Semester</option>
                  <option>Mid Semester</option>
                  <option>Internal1</option>
                  <option>Internal2</option>
                  <option>Other</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Google Drive Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text3">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <input 
                type="url" 
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..." 
                className="w-full bg-bg2 border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors" 
              />
            </div>
            <div className="text-[10px] text-text3 mt-1.5 flex gap-1 items-start">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-accent-amber">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Please ensure the link is set to <strong>"Anyone with the link can view"</strong>.</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full mt-6 bg-primary text-white rounded-xl py-3 text-sm font-semibold cursor-pointer transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};

const PYQsScreen = ({ onNavClick }) => {
  const [activeTab, setActiveTab] = useState('pyqs');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/pyqs');
      setItems(res.data.data)
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter based on active tab, filter type and search query
  const filteredItems = items.filter(item => {
    // 1. Filter by Segmented Control (pyqs -> PYQ, notes -> Notes)
    const isPyqTab = activeTab === 'pyqs';
    if (isPyqTab && item.examType === 'Notes') return false;
    if (!isPyqTab && item.examType !== 'Notes') return false;
    
    // 2. Filter by search query
    if (searchQuery && !item.subjectName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 3. Filter by horizontal tabs (if searching PYQs)
    if (isPyqTab && activeFilter !== 'All') {
      if (item.examType !== activeFilter) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav onNavClick={onNavClick} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-[60px] pb-6 scrollbar-hide bg-bg">
        <SegmentedControl active={activeTab} setActive={setActiveTab} />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {activeTab === 'pyqs' && (
          <HorizontalTabs 
            tabs={['All', 'End Semester', 'Mid Semester', 'Internal1', 'Internal2', 'Other']} 
            activeTab={activeFilter} 
            setActiveTab={setActiveFilter} 
          />
        )}

        <div className="mt-2">
          {isLoading ? (
            // Skeleton Loading State
            <>
              <PYQSkeleton />
              <PYQSkeleton />
              <PYQSkeleton />
              <PYQSkeleton />
            </>
          ) : (
            <div className="mb-6">
              {filteredItems.map(item => (
                <PYQCard
                  key={item._id}
                  subjectName={item.subjectName}
                  year={item.year}
                  examType={item.examType}
                  isApproved={item.isApproved}
                  questionPaperUrl={item.questionPaperUrl}
                />
              ))}
            </div>
          )}

          {(!isLoading && filteredItems.length === 0) && (
            <div className="text-center text-text3 text-sm py-10">
              No files found.
            </div>
          )}
        </div>
      </div>
      
      <UploadFloatingButton onClick={() => setIsModalOpen(true)} />
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={fetchItems}
      />
    </div>
  );
};

export default PYQsScreen;
