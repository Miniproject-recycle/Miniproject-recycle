import React from "react";

const SectionCard = ({ title, children }) => (
  <div className="section-card">
    <h3 className="section-title">{title}</h3>
    <div className="section-content">{children}</div>
  </div>
);

const PlaceholderList = ({ message = "검색 후 결과가 표시됩니다." }) => (
  <ul className="bullet-list">
    <li>{message}</li>
  </ul>
);

const ResultSections = ({ result }) => {
  const category = result?.category || "-";
  const disposal = result?.disposal || [];
  const cautions = result?.cautions || [];
  const tips = result?.tips || [];

  return (
    <div className="result-details">
      <SectionCard title="품목 종류">
        <p className="category-text">{category}</p>
      </SectionCard>

      <SectionCard title="분리배출 방법">
        {disposal.length > 0 ? (
          <ul className="bullet-list">
            {disposal.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <PlaceholderList />
        )}
      </SectionCard>

      <SectionCard title="주의사항 및 오해 방지">
        {cautions.length > 0 ? (
          <ul className="bullet-list">
            {cautions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <PlaceholderList />
        )}
      </SectionCard>

      <SectionCard title="환경 친화 팁">
        {tips.length > 0 ? (
          <ul className="bullet-list">
            {tips.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <PlaceholderList />
        )}
      </SectionCard>
    </div>
  );
};

export default ResultSections;
