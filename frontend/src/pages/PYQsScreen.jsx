import { useState } from "react";
import { PYQSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import api from "../context/api.js";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    {['PYQs', 'Notes', 'Quiz'].map(opt => {
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

const PYQCard = ({ subjectName, year, examType, isApproved, questionPaperUrl, notesContent, onQuizClick }) => (
  <div onClick={() => questionPaperUrl && window.open(questionPaperUrl, '_blank')} className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 flex flex-col gap-3 cursor-pointer hover:border-border2 transition-colors relative overflow-hidden group">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-2xl bg-opacity-15 bg-primary flex items-center justify-center text-primary-mid flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
        </svg>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-sm font-semibold text-text font-syne flex items-center gap-2 flex-wrap">
          {subjectName}
          {!isApproved && (
            <span className="px-1.5 py-0.5 rounded-sm bg-accent-amber bg-opacity-20 text-[9px] text-accent-amber font-medium uppercase tracking-wider">
              Pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-text3">{year}</span>
          <span className="w-1 h-1 rounded-full bg-border2"></span>
          <span className="text-xs text-text3">{examType}</span>
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); if (questionPaperUrl) window.open(questionPaperUrl, '_blank'); }}
        disabled={!questionPaperUrl}
        className="flex-1 px-2.5 h-8 rounded-full bg-primary/20 text-primary-mid border border-primary/30 flex items-center gap-1.5 text-[11px] font-semibold hover:bg-primary hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed justify-center"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>
      {examType === 'Notes' && isApproved && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onQuizClick && onQuizClick(); }}
          className="flex-1 px-2.5 h-8 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-400 border border-violet-500/30 flex items-center gap-1.5 text-[11px] font-semibold hover:from-violet-600 hover:to-indigo-600 hover:text-white transition-all cursor-pointer justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          Quiz Yourself
        </button>
      )}
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
  const [fileUrl, setFileUrl] = useState('');
  const [notesContent, setNotesContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTxtUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNotesContent(ev.target.result || '');
    reader.readAsText(file);
  };

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
        examType: type === 'PYQ' ? examType : 'Notes',
        notesContent: type === 'Note' ? notesContent : ''
      });
      if (response.data) {
        setSubjectName(''); setYear(''); setFileUrl(''); setNotesContent('');
        toast.success(`${type} submitted! Pending review.`, { id: 'submit-pyq', duration: 2500 });
        onUploadSuccess?.();
        onClose();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity" onClick={onClose}>
      <div className="bg-bg w-full sm:w-[400px] p-5 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-text font-syne">Upload Resource</h2>
          <button onClick={onClose} className="text-text3 hover:text-text cursor-pointer bg-bg2 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="flex bg-bg2 p-1 rounded-xl mb-5">
          {['PYQ', 'Note'].map(opt => (
            <button key={opt} onClick={() => setType(opt)} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${type === opt ? 'bg-primary text-white shadow-sm' : 'text-text3 hover:text-text'}`}>{opt}</button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {error && <div className="text-accent-amber text-xs font-medium p-2 bg-accent-amber/10 rounded-lg">{error}</div>}
          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Subject Name</label>
            <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="e.g. Data Structures" className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-text3 font-medium mb-1 block">Semester</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 1, 2, 3" className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" />
            </div>
            {type === 'PYQ' && (
              <div className="flex-[2]">
                <label className="text-xs text-text3 font-medium mb-1 block">Exam Type</label>
                <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:border-primary-mid appearance-none cursor-pointer">
                  <option>End Semester</option><option>Mid Semester</option><option>Internal1</option><option>Internal2</option><option>Other</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Google Drive Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </div>
              <input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full bg-bg2 border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid transition-colors" />
            </div>
            <div className="text-[10px] text-text3 mt-1.5 flex gap-1 items-start">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-accent-amber"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>Please ensure the link is set to <strong>"Anyone with the link can view"</strong>.</span>
            </div>
          </div>

          {type === 'Note' && (
            <div>
              <label className="text-xs text-text3 font-medium mb-1 block">Notes Content <span className="text-text3/50">(optional — enables quiz generation)</span></label>
              <textarea value={notesContent} onChange={e => setNotesContent(e.target.value)} placeholder="Paste your notes text here..." rows={4} className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid resize-none" />
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg2 border border-border text-xs text-text3 font-medium cursor-pointer hover:bg-border transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload .txt
                  <input type="file" accept=".txt" onChange={handleTxtUpload} className="hidden" />
                </label>
                {notesContent && <span className="text-[10px] text-emerald-400">✓ {notesContent.length} chars</span>}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className={`w-full mt-6 bg-primary text-white rounded-xl py-3 text-sm font-semibold cursor-pointer transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'}`}>
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
};

const NotesContentModal = ({ isOpen, onClose, onSubmit, isGenerating }) => {
  const [text, setText] = useState('');
  const handleTxt = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target.result || '');
    reader.readAsText(file);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-bg w-full sm:w-[400px] p-5 rounded-t-3xl sm:rounded-3xl border border-border" onClick={e => e.stopPropagation()}>
        <h2 className="text-base font-bold text-text font-syne mb-1">Add Notes Content</h2>
        <p className="text-xs text-text3 mb-4">Paste your notes text to generate a personalized quiz.</p>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste notes content here..." rows={5} className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid resize-none mb-2" />
        <div className="flex items-center gap-2 mb-4">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg2 border border-border text-xs text-text3 font-medium cursor-pointer hover:bg-border transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload .txt
            <input type="file" accept=".txt" onChange={handleTxt} className="hidden" />
          </label>
          {text && <span className="text-[10px] text-emerald-400">✓ {text.length} chars</span>}
        </div>
        <button onClick={() => onSubmit(text)} disabled={!text.trim() || isGenerating} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
          {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </div>
    </div>
  );
};

const QuizCard = ({ quiz, onClick }) => (
  <div onClick={onClick} className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 cursor-pointer hover:border-violet-500/30 transition-colors">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center text-violet-400 flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text font-syne">{quiz.subjectName}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text3">Sem {quiz.semester}</span>
          <span className="w-1 h-1 rounded-full bg-border2"></span>
          <span className="text-xs text-text3">{quiz.questions?.length || 10} questions</span>
        </div>
        <div className="text-[10px] text-text3 mt-1">by {quiz.generatedBy?.name || 'Anonymous'}</div>
      </div>
      <div className="flex items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text3"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  </div>
);

const GenerateQuizModal = ({ isOpen, onClose, onSuccess, isGenerating }) => {
  const [subjectName, setSubjectName] = useState('');
  const [semester, setSemester] = useState('');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (ext !== 'txt' && ext !== 'pdf') {
      setError('Only .txt and .pdf files are supported');
      return;
    }
    setFile(f);
    setError('');
    // For .txt files, also read content into textarea
    if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (ev) => setTextContent(ev.target.result || '');
      reader.readAsText(f);
    }
  };

  const handleSubmit = () => {
    if (!subjectName.trim() || !semester.trim()) {
      setError('Subject name and semester are required');
      return;
    }
    if (!textContent.trim() && !file) {
      setError('Please paste text or upload a file');
      return;
    }
    onSuccess({ subjectName, semester, textContent, file });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-bg w-full sm:w-[420px] p-5 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-text font-syne">Generate Quiz</h2>
          <button onClick={onClose} className="text-text3 hover:text-text cursor-pointer bg-bg2 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          {error && <div className="text-red-400 text-xs font-medium p-2 bg-red-500/10 rounded-lg border border-red-500/20">{error}</div>}

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Subject Name</label>
            <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="e.g. Data Structures" className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" />
          </div>

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Semester</label>
            <input type="number" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g. 3" className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid" />
          </div>

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Upload Notes <span className="text-text3/50">(.txt or .pdf)</span></label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg2 border border-dashed border-border text-sm text-text3 cursor-pointer hover:bg-border transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {file ? file.name : 'Choose file...'}
              <input type="file" accept=".txt,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
            {file && <span className="text-[10px] text-emerald-400 mt-1 block">✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>}
          </div>

          <div>
            <label className="text-xs text-text3 font-medium mb-1 block">Or paste text directly</label>
            <textarea value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="Paste your notes here..." rows={4} className="w-full bg-bg2 border border-border rounded-xl px-3 py-2 text-sm text-text placeholder-text3 outline-none focus:border-primary-mid resize-none" />
            {textContent.trim().length > 0 && <span className="text-[10px] text-text3 mt-0.5 block">{textContent.length} characters</span>}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isGenerating} className={`w-full mt-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm cursor-pointer transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:from-violet-700 hover:to-indigo-700'}`}>
          {isGenerating ? 'Generating...' : 'Generate Quiz'}
        </button>

        <p className="text-[10px] text-text3 mt-2 text-center">Files are not stored. Only the generated quiz is saved.</p>
      </div>
    </div>
  );
};

const PYQsScreen = ({ onNavClick }) => {
  const [activeTab, setActiveTab] = useState('pyqs');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeExamType, setActiveExamType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [notesModalTarget, setNotesModalTarget] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['pyqs'],
    queryFn: async () => {
      const res = await api.get('/pyqs');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: allQuizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.get('/quiz/all');
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
    enabled: activeTab === 'quiz',
  });

  const generateMutation = useMutation({
    mutationFn: async ({ pyqId, customText }) => {
      const res = await api.post('/quiz/generate', { pyqId, customText });
      return res.data.data;
    },
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      navigate(`/quiz/${quiz._id}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to generate quiz');
    },
  });

  const standaloneMutation = useMutation({
    mutationFn: async ({ subjectName, semester, textContent, file }) => {
      const formData = new FormData();
      formData.append('subjectName', subjectName);
      formData.append('semester', semester);
      if (file) formData.append('file', file);
      if (textContent) formData.append('textContent', textContent);
      const res = await api.post('/quiz/generate-standalone', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    },
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setIsQuizModalOpen(false);
      navigate(`/quiz/${quiz._id}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to generate quiz');
    },
  });

  const handleQuizClick = async (item) => {
    try {
      // Check for existing quizzes first — avoid burning AI tokens
      const res = await api.get(`/quiz/note/${item._id}`);
      const existingQuizzes = res.data?.data || [];
      if (existingQuizzes.length > 0) {
        // Navigate to the most recent quiz directly
        navigate(`/quiz/${existingQuizzes[0]._id}`);
        return;
      }
    } catch {
      // If check fails, fall through to generate
    }

    // No existing quiz — generate a new one
    if (item.notesContent && item.notesContent.trim().length > 0) {
      generateMutation.mutate({ pyqId: item._id });
    } else {
      setNotesModalTarget(item);
    }
  };

  const handleNotesContentSubmit = (text) => {
    if (!notesModalTarget) return;
    generateMutation.mutate({ pyqId: notesModalTarget._id, customText: text });
    setNotesModalTarget(null);
  };

  const uniqueSemesters = ['All', ...Array.from(new Set(items.map(item => String(item.year)).filter(Boolean))).sort((a, b) => parseInt(a) - parseInt(b))];
  const semesterTabs = uniqueSemesters.map(sem => sem === 'All' ? 'All' : `Sem ${sem}`);

  const filteredItems = items.filter(item => {
    const isPyqTab = activeTab === 'pyqs';
    if (activeTab === 'quiz') return false;
    if (isPyqTab && item.examType === 'Notes') return false;
    if (!isPyqTab && item.examType !== 'Notes') return false;
    if (searchQuery && !item.subjectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter !== 'All') {
      const semesterNumber = activeFilter.replace('Sem ', '');
      if (String(item.year) !== semesterNumber) return false;
    }
    if (isPyqTab && activeExamType !== 'All') {
      if (item.examType !== activeExamType) return false;
    }
    return true;
  });

  const filteredQuizzes = allQuizzes.filter(q => {
    if (searchQuery && !q.subjectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
      <TopNav onNavClick={onNavClick} />

      <div className="flex-1 overflow-y-auto px-4 pt-[60px] pb-6 scrollbar-hide bg-bg">
        <SegmentedControl active={activeTab} setActive={(tab) => {
          setActiveTab(tab);
          setActiveFilter('All');
          setActiveExamType('All');
        }} />

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {activeTab !== 'quiz' && (
          <>
            <button onClick={() => setShowFilters(!showFilters)} className="mb-3 px-3 py-2 rounded-lg bg-bg2 border border-border hover:bg-border transition-colors flex items-center gap-2 text-text text-xs font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {showFilters && (
              <>
                <HorizontalTabs tabs={semesterTabs} activeTab={activeFilter} setActiveTab={setActiveFilter} />
                {activeTab === 'pyqs' && (
                  <HorizontalTabs tabs={['All', 'Internal1', 'Internal2']} activeTab={activeExamType} setActiveTab={setActiveExamType} />
                )}
              </>
            )}
          </>
        )}

        <div className="mt-2">
          {activeTab === 'quiz' ? (
            // Quiz tab content
            quizzesLoading ? (
              <><PYQSkeleton /><PYQSkeleton /><PYQSkeleton /></>
            ) : filteredQuizzes.length > 0 ? (
              <div className="mb-6">
                {filteredQuizzes.map(quiz => (
                  <QuizCard key={quiz._id} quiz={quiz} onClick={() => navigate(`/quiz/${quiz._id}`)} />
                ))}
              </div>
            ) : (
              <div className="text-center text-text3 text-sm py-10">
                <div className="text-3xl mb-2">📝</div>
                No quizzes yet. Generate one from the Notes tab!
              </div>
            )
          ) : isLoading ? (
            <><PYQSkeleton /><PYQSkeleton /><PYQSkeleton /><PYQSkeleton /></>
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
                  notesContent={item.notesContent}
                  onQuizClick={() => handleQuizClick(item)}
                />
              ))}
            </div>
          )}

          {(!isLoading && activeTab !== 'quiz' && filteredItems.length === 0) && (
            <div className="text-center text-text3 text-sm py-10">No files found.</div>
          )}
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <UploadFloatingButton onClick={() => setIsQuizModalOpen(true)} />
      ) : (
        <UploadFloatingButton onClick={() => setIsModalOpen(true)} />
      )}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ['pyqs'] })} />
      <NotesContentModal isOpen={!!notesModalTarget} onClose={() => setNotesModalTarget(null)} onSubmit={handleNotesContentSubmit} isGenerating={generateMutation.isPending} />
      <GenerateQuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} onSuccess={(data) => standaloneMutation.mutate(data)} isGenerating={standaloneMutation.isPending} />

      {(generateMutation.isPending || standaloneMutation.isPending) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-bg rounded-2xl p-6 border border-border flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            <p className="text-sm text-text font-semibold">Generating your quiz...</p>
            <p className="text-[10px] text-text3">This may take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PYQsScreen;
