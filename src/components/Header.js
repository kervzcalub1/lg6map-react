import React from 'react';

const Header = ({ onMobileHistoryOpen }) => {
  return (
    <header className="app-header">
      <h1>LG 6 MAP</h1>
      <div className="header-actions">
        <button 
          id="openHistoryMobile" 
          className="hamburger d-md-none" 
          title="History (mobile)"
          onClick={onMobileHistoryOpen}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
