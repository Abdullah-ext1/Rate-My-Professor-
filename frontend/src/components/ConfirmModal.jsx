import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", confirmColor = "bg-red-500" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 transition-opacity" onClick={onClose}>
      <div className="bg-bg w-full max-w-sm rounded-3xl p-6 border border-border shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-text font-syne mb-2">{title}</h2>
        <p className="text-sm text-text3 mb-6">{message}</p>
        
        <div className="flex gap-3 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-bg2 border border-border hover:bg-bg3 text-text transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors cursor-pointer ${confirmColor === 'bg-red-500' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;