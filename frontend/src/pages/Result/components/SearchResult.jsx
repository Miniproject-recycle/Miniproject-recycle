import React from "react";
import ImagePreview from "./ImagePreview";
import ResultSections from "./ResultSections";

const SearchResult = ({ imageUrl, result, isLoading }) => {
  return (
    <div className="search-result">
      <h2 className="result-title">검색 결과</h2>
      <ImagePreview imageUrl={imageUrl} />
      {isLoading ? (
        <div className="loading">분석 중...</div>
      ) : (
        result && <ResultSections result={result} />
      )}
    </div>
  );
};

export default SearchResult;
