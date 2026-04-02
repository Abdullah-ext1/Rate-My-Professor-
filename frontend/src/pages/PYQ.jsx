import { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import PYQCard from '../components/PYQCard';
import '../styles/PYQ.css';

const PYQ = () => {
  const [pyqs, setPyqs] = useState([
    {
      id: 1,
      subject: 'Data Structures & Algorithms',
      badge: 'End Semester',
      badgeClass: 'badge-endsem',
      year: '2024',
      downloads: 312,
    },
    {
      id: 2,
      subject: 'Operating Systems',
      badge: 'Mid Semester',
      badgeClass: 'badge-midsem',
      year: '2023',
      downloads: 203,
    },
    {
      id: 3,
      subject: 'Database Management Systems',
      badge: 'End Semester',
      badgeClass: 'badge-endsem',
      year: '2024',
      downloads: 87,
    },
    {
      id: 4,
      subject: 'Engineering Mathematics III',
      badge: 'Internal 1',
      badgeClass: 'badge-internal',
      year: '2024',
      downloads: 156,
    },
    {
      id: 5,
      subject: 'Data Structures & Algorithms',
      badge: 'Mid Semester',
      badgeClass: 'badge-midsem',
      year: '2023',
      downloads: 412,
    },
  ]);

  return (
    <div className="app-layout">
      <ChatSidebar activeView="pyq" />
      <div className="main">
        <div className="topbar">
          <div className="page-title">PYQs</div>
          <button className="post-btn">+ Upload PYQ</button>
        </div>

        <div className="pyq-content">
          <div className="pyq-filters">
            <select className="pyq-select">
              <option>All subjects</option>
              <option>Data Structures</option>
              <option>OS</option>
              <option>DBMS</option>
              <option>Maths III</option>
            </select>
            <select className="pyq-select">
              <option>All years</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
            <select className="pyq-select">
              <option>All types</option>
              <option>End Semester</option>
              <option>Mid Semester</option>
              <option>Internal 1</option>
              <option>Internal 2</option>
            </select>
          </div>

          {pyqs.map((pyq) => (
            <PYQCard key={pyq.id} pyq={pyq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PYQ;
