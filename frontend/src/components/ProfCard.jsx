import '../styles/ProfCard.css';

const ProfCard = ({ professor }) => {
  return (
    <div className="prof-card">
      <div className="prof-top">
        <div className="prof-av">{professor.initials}</div>
        <div>
          <div className="prof-name">{professor.name}</div>
          <div className="prof-sub">{professor.subject}</div>
        </div>
        <div className="prof-score">
          <div className={`score-num ${professor.scoreClass}`}>{professor.score}</div>
          <div className="score-lbl">{professor.reviews} reviews</div>
        </div>
      </div>
      <div className="pills">
        {professor.pills.map((pill, idx) => (
          <span key={idx} className={pill.class}>
            {pill.text}
          </span>
        ))}
      </div>
      <div className="prof-review">{professor.review}</div>
    </div>
  );
};

export default ProfCard;
