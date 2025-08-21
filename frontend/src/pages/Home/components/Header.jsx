import React from "react";

const Header = ({ onOpenGuide }) => {
  const handleGuideClick = (e) => {
    e.preventDefault();
    onOpenGuide?.();
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <img src="/images/logo_1.png" alt="쓱 ~ 분리" className="logo-image" />
          </div>
        </div>

    
        <nav className="navigation">
          <a href="#" className="nav-link" onClick={handleHomeClick}>
            홈
          </a>
          <a href="#" className="nav-link" onClick={handleGuideClick}>
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
