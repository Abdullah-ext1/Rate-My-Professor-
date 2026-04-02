import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import AttendanceCard from '../components/AttendanceCard';
import '../styles/Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      subject: 'Data Structures',
      prof: 'Prof. Patil',
      percentage: 84,
      classes: '21 / 25',
      bunkStatus: 'Can bunk 3 more',
      statusClass: 'safe',
      barClass: 'bar-safe',
    },
    {
      id: 2,
      subject: 'Operating Systems',
      prof: 'Prof. Rao',
      percentage: 76,
      classes: '19 / 25',
      bunkStatus: '1 bunk left',
      statusClass: 'warn',
      barClass: 'bar-warn',
      statusColor: 'amber',
    },
    {
      id: 3,
      subject: 'Database Management',
      prof: 'Prof. Mehta',
      percentage: 63,
      classes: '15 / 24',
      bunkStatus: 'Cannot bunk at all',
      statusClass: 'danger',
      barClass: 'bar-danger',
      statusColor: 'red',
      warning: 'Attend 6 more in a row to hit 75%. No bunks until Week 12.',
    },
    {
      id: 4,
      subject: 'Engineering Maths III',
      prof: 'Prof. Joshi',
      percentage: 91,
      classes: '22 / 24',
      bunkStatus: 'Can bunk 6 more',
      statusClass: 'safe',
      barClass: 'bar-safe',
    },
  ]);

  return (
    <div className="app-layout">
      <ChatSidebar activeView="attendance" />
      <div className="main">
        <div className="topbar">
          <div className="page-title">Attendance</div>
          <button className="post-btn">+ Add subject</button>
        </div>

        <div className="att-content">
          <div className="att-banner">
            <div className="att-banner-icon">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--p-mid)" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3l2 2" />
              </svg>
            </div>
            <div>
              <div className="att-banner-title">You can bunk 4 more classes total</div>
              <div className="att-banner-sub">across all subjects this semester</div>
            </div>
          </div>

          {attendanceData.map((att) => (
            <AttendanceCard key={att.id} attendance={att} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
