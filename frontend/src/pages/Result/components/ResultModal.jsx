import React from "react";
import SearchResult from "./SearchResult";

const ResultModal = ({ open, onClose, imageUrl, result, isLoading }) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <div className="modal-header">
          <h2 id="result-title">검색 결과</h2>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <div className="modal-body">
          <SearchResult
            imageUrl={imageUrl}
            result={result}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
