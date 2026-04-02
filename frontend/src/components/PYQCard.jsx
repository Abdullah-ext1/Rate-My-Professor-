import '../styles/PYQCard.css';

const PYQCard = ({ pyq }) => {
  return (
    <div className="pyq-card">
      <div className="pyq-info">
        <div className="pyq-subject">{pyq.subject}</div>
        <div className="pyq-meta">
          <span className={`pyq-badge ${pyq.badgeClass}`}>{pyq.badge}</span>
          <span className="pyq-year">
            {pyq.year} · {pyq.downloads} downloads
          </span>
        </div>
      </div>
      <button className="download-btn">Download</button>
    </div>
  );
};

export default PYQCard;
