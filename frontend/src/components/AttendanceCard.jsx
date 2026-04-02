import '../styles/AttendanceCard.css';

const AttendanceCard = ({ attendance }) => {
  return (
    <div className={`att-card ${attendance.statusClass}`}>
      <div className="att-head">
        <div>
          <div className="att-subject">{attendance.subject}</div>
          <div className="att-prof">{attendance.prof}</div>
        </div>
        <div className={`att-pct pct-${attendance.statusClass}`}>{attendance.percentage}%</div>
      </div>
      <div className="att-bar-wrap">
        <div className={`att-bar ${attendance.barClass}`} style={{ width: `${attendance.percentage}%` }}></div>
      </div>
      <div className="att-meta">
        <span>{attendance.classes} classes</span>
        <span style={{ color: attendance.statusColor === 'red' ? 'var(--red)' : 'var(--teal)', fontWeight: 500 }}>
          {attendance.bunkStatus}
        </span>
      </div>
      {attendance.warning && <div className="att-warning">{attendance.warning}</div>}
      {!attendance.warning && (
        <div className="att-btns">
          <button className="att-btn att-btn-yes">Attended today</button>
          <button className="att-btn att-btn-no">Bunked today</button>
        </div>
      )}
    </div>
  );
};

export default AttendanceCard;
