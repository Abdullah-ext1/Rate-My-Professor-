import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../context/api.js';

const getTitle = (sub) => `${sub.subjectName} ${sub.year} - ${sub.examType}`
const getType = (sub) => sub.examType === 'Notes' ? 'Note' : 'PYQ'

export default function ModeratorDashboard({ onNavClick }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'
  const [submissions, setSubmissions] = useState([]);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const isApprovedStatus = activeTab === 'approved'
        const res = await api.get(`/pyqs?isApproved=${isApprovedStatus}`)
        setSubmissions(res.data.data)
      } catch (err) {
        console.error('Failed to fetch PYQs', err)
      }
    }
    fetchSubmissions()
  }, [activeTab])

  const handleApprove = async (id) => {
    try {
      await api.put(`/pyqs/${id}`, { isApproved: true })
      setSubmissions(prev => prev.filter(sub => sub._id !== id))
    } catch (err) {
      console.error('Failed to approve', err)
    }
  }

  const handleReject = async (id) => {
    try {
      await api.delete(`/pyqs/${id}`)
      setSubmissions(prev => prev.filter(sub => sub._id !== id))
    } catch (err) {
      console.error('Failed to reject', err)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text1 pb-20">
      {/* Top Navigation */}
      <div className="bg-bg/80 backdrop-blur-md sticky top-0 z-30 border-b border-border px-4 py-3 pb-2 flex items-center shadow-sm">
        <button 
          onClick={() => onNavClick('pyqs')}
          className="mr-3 p-2 bg-elem-light rounded-full text-text2 hover:text-text1 hover:bg-elem-hover transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-mid to-secondary-mid bg-clip-text text-transparent">
            Moderator Dashboard
          </h1>
          <p className="text-xs text-text3">Manage Vault Submissions</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Tab Controls (Optional, just pending for now in mock) */}
        <div className="flex space-x-2 mb-6">
          <button 
             className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
               activeTab === 'pending' ? 'bg-primary-mid text-bg' : 'bg-elem-light text-text2 hover:bg-elem-hover'
             }`}
             onClick={() => setActiveTab('pending')}
          >
            Pending ({submissions.length})
          </button>
          <button 
             className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
               activeTab === 'approved' ? 'bg-primary-mid text-bg' : 'bg-elem-light text-text2 hover:bg-elem-hover'
             }`}
             onClick={() => setActiveTab('approved')}
          >
            History
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-text3 flex flex-col items-center">
              <svg className="w-16 h-16 text-elem border border-border p-4 rounded-full mb-4 shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-text1 text-lg">All Caught Up!</h3>
              <p className="text-sm mt-1 max-w-xs">There are no pending submissions in the queue right now.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div key={sub._id} className="bg-elem-light rounded-xl p-4 border border-border shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        getType(sub) === 'PYQ' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {getType(sub)}
                      </span>
                      <span className="text-xs text-text3">• {new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-text1 leading-tight">{getTitle(sub)}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-text2 my-3 bg-bg/50 p-2.5 rounded-lg border border-border/50">
                  <div>
                    <span className="text-text3 text-xs block mb-0.5">Subject</span>
                    <span className="font-medium">{sub.subjectName}</span>
                  </div>
                  <div>
                    <span className="text-text3 text-xs block mb-0.5">Year / Exam</span>
                    <span className="font-medium">{sub.year} • {sub.examType}</span>
                  </div>
                  <div className="col-span-2 mt-1">
                    <span className="text-text3 text-xs block mb-0.5">Submitted By</span>
                    <span className="font-medium">{sub.owner.name}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <a 
                    href={sub.questionPaperUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center text-sm text-primary-light hover:text-primary-mid transition-colors bg-primary-dark/10 p-2 rounded-lg border border-primary-dark/20 w-fit"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Drive Link
                  </a>
                </div>

                <div className="flex space-x-3 mt-4 border-t border-border pt-4">
                  <button 
                    onClick={() => handleReject(sub._id)}
                    className="flex-1 py-2 rounded-lg font-semibold text-sm border-2 border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    {activeTab === 'approved' ? 'Delete' : 'Reject'}
                  </button>
                  {activeTab === 'pending' && (
                    <button 
                      onClick={() => handleApprove(sub._id)}
                      className="flex-1 py-2 rounded-lg font-semibold text-sm bg-primary-mid text-bg hover:bg-primary-light transition-colors shadow-lg shadow-primary-mid/20"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
