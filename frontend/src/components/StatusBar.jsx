const StatusBar = () => (
  <div className="bg-bg px-5 py-2.5 flex items-center justify-between text-xs flex-shrink-0">
    <span className="text-text font-medium">9:41</span>
    <div className="flex gap-1 items-center">
      <svg width="11" height="11" viewBox="0 0 16 16" fill="#F0EFF8" opacity="0.8">
        <rect x="1" y="5" width="2" height="10" rx="1" />
        <rect x="5" y="3" width="2" height="12" rx="1" />
        <rect x="9" y="1" width="2" height="14" rx="1" />
        <rect x="13" y="0" width="2" height="16" rx="1" opacity="0.3" />
      </svg>
      <svg width="20" height="10" viewBox="0 0 22 11" fill="none">
        <rect x="0.5" y="0.5" width="18" height="10" rx="3" stroke="white" strokeOpacity="0.4" />
        <rect x="1.5" y="1.5" width="13" height="8" rx="2" fill="white" />
        <path d="M20 3.5v3a1.5 1.5 0 000-3z" fill="white" opacity="0.4" />
      </svg>
    </div>
  </div>
);

export default StatusBar;
