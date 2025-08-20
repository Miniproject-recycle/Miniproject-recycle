import React from "react";

const ResultCard = ({ result }) => {
  const handleShare = () => {
    // TODO: 공유 기능 구현
    console.log("Share result:", result);
  };

  return (
    <div className="result-section">
      <h2>분석 결과</h2>

      <div className="result-card">
        <div className="result-header">
          <div className="category-badge">{result.category}</div>
          <div className="confidence">신뢰도: {result.confidence}%</div>
          <button className="share-btn" onClick={handleShare}>
            공유
          </button>
        </div>

        <div className="result-content">
          <h3>분리수거 방법:</h3>
          <ul className="guide-list">
            {result.guide.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
