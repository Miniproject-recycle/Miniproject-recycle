import React from "react";

// 아이콘 컴포넌트들
const CategoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const DisposalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13H5v-2h14v2z" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const CautionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
  </svg>
);

const TipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const SectionCard = ({ title, children, icon: Icon, color = "#4CAF50" }) => (
  <div className="section-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="section-header">
      <div className="section-icon" style={{ color }}>
        <Icon />
      </div>
      <h3 className="section-title">{title}</h3>
    </div>
    <div className="section-content">{children}</div>
  </div>
);

const PlaceholderList = ({ message = "검색 후 결과가 표시됩니다." }) => (
  <div className="placeholder-content">
    <div className="placeholder-icon">🔍</div>
    <p className="placeholder-text">{message}</p>
  </div>
);

const ResultSections = ({ result }) => {
  const category = result?.category || "-";
  const disposal = result?.disposal || [];
  const cautions = result?.cautions || [];
  const tips = result?.tips || [];

  return (
    <div className="result-details">
      <SectionCard title="품목 종류" icon={CategoryIcon} color="#4CAF50">
        <div className="category-display">
          <span className="category-badge-large">{category}</span>
        </div>
      </SectionCard>

      <SectionCard title="분리배출 방법" icon={DisposalIcon} color="#2196F3">
        {disposal.length > 0 ? (
          <ul className="bullet-list enhanced">
            {disposal.map((item, idx) => (
              <li key={idx} className="list-item">
                <span className="list-number">{idx + 1}</span>
                <span className="list-text">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <PlaceholderList message="분리배출 방법을 검색해보세요" />
        )}
      </SectionCard>

      <SectionCard
        title="주의사항 및 오해 방지"
        icon={CautionIcon}
        color="#FF9800"
      >
        {cautions.length > 0 ? (
          <ul className="bullet-list enhanced">
            {cautions.map((item, idx) => (
              <li key={idx} className="list-item caution">
                <span className="list-icon">⚠️</span>
                <span className="list-text">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <PlaceholderList message="주의사항을 확인해보세요" />
        )}
      </SectionCard>

      <SectionCard title="환경 친화 팁" icon={TipIcon} color="#9C27B0">
        {tips.length > 0 ? (
          <ul className="bullet-list enhanced">
            {tips.map((item, idx) => (
              <li key={idx} className="list-item tip">
                <span className="list-icon">💡</span>
                <span className="list-text">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <PlaceholderList message="환경 친화 팁을 확인해보세요" />
        )}
      </SectionCard>
    </div>
  );
};

export default ResultSections;
