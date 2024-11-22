// src/components/TopBar.js

import React from 'react';
import '../styles/TopBar.css'; 
import logoImage from '../assets/images/logo.png'; 

const TopBar = ({ onProfileClick }) => {
  return (
    <header className="top-bar">
      <div className="logo-image">
        <img src={logoImage} alt="TwitSnap Logo" className="logo-image" />
      </div>
      <div className="logo">
        <span className="logo-title">TwitSnap Backoffice</span> {/* Aplica la nueva clase aquí */}
      </div>
      <div className="profile" onClick={onProfileClick}>
        <span>Mi perfil</span>
        <img
          src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
          alt="Profile"
          className="profile-image"
        />
      </div>
    </header>
  );
};

export default TopBar;
