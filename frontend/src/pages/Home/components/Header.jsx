import React from "react";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#ffffff" />
              <path d="M15 15 L25 20 L15 25 Z" fill="#4CAF50" />
            </svg>
          </div>
          <span className="logo-text">쓱 ~ 분리</span>
        </div>

        <nav className="navigation">
          <a href="#" className="nav-link">
            홈
          </a>
          <a href="#" className="nav-link">
            가이드
          </a>
          <a href="#" className="nav-link">
            팁
          </a>
          <a href="#" className="nav-link">
            정보
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
