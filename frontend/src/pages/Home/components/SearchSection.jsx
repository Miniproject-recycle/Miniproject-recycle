import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularTags = ["플라스틱", "유리", "종이", "음식물"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="search-section">
      <h2>또는 검색으로 찾기</h2>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="분리수거 방법을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            검색
          </button>
        </div>
      </form>

      <div className="popular-tags">
        <p>인기 검색어:</p>
        <div className="tags">
          {popularTags.map((tag, index) => (
            <button
              key={index}
              className="tag"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
