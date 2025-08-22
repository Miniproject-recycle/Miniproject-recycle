import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);


  // const popularTags = ["플라스틱", "유리", "종이", "음식물"];


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("텍스트를 입력해주세요");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError("");
    onSearch(searchQuery.trim());
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setError("");
    onSearch(tag);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (error && value.trim()) {
      setError("");
    }
  };

  return (
    <div className="search-section">
      

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className={`search-input${error ? " error" : ""}${
                shake ? " shake" : ""
              }`}
              placeholder="분리수거 방법을 검색하세요"
              value={searchQuery}
              onChange={handleChange}
              aria-invalid={!!error}
              aria-describedby={error ? "search-error" : undefined}
            />
            {error && (
              <p id="search-error" className="error-text inline">
                {error}
              </p>
            )}
          </div>

          <button type="submit" className="search-btn">

            검색
          </button>
        </div>
      </form>

      <div className="popular-tags">
        {/* <p>인기 검색어:</p> */}
        {/* <div className="tags">
          {popularTags.map((tag, index) => (
            <button
              key={index}
              className="tag"
              type="button"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default SearchSection;
