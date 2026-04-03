const AttendanceScreen = ({ onNavClick }) => (
  <div className="flex flex-col flex-1 overflow-hidden bg-bg relative">
    <div className="fixed top-12 left-0 right-0 bg-bg px-4 py-2.5 flex items-center justify-between flex-shrink-0 border-b border-border z-30">
      <div className="flex items-center gap-2">
        <div className="text-base font-bold text-text font-syne">campus<span className="text-primary-mid">.</span></div>
        <div className="text-xs px-2 py-0.5 rounded-full bg-opacity-15 bg-primary border border-opacity-30 border-primary text-primary-mid font-medium">Rizvi</div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto px-3.5 py-3 scrollbar-hide bg-bg pt-16">
      <p className="text-text3 text-center py-8">Attendance tracking feature</p>
    </div>
  </div>
);

export default AttendanceScreen;
