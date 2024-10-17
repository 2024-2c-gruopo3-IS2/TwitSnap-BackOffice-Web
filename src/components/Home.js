import React, { useState } from 'react';
import SideBar from './SideBar';
import ServiceView from './ServiceView';
import BlockUsers from './BlockUsers';
import TwitSnapsView from './TwitSnapsView';
import logo from '../assets/images/logo.png'; // Asegúrate de que la ruta sea correcta
import '../styles/Home.css';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('services');

  return (
    <div className="home-container">
      <header className="top-bar">
        <div className="logo">
          <img src={logo} className="logo-image" alt="Custom Logo" />
          <span>TwitSnap BackOffice</span>
        </div>
        <div className="profile">
          <span>Mi perfil</span>
          <img
            src="https://static-00.iconduck.com/assets.00/profile-user-icon-2048x2048-m41rxkoe.png"
            alt="Profile"
            className="profile-image"
          />
        </div>
      </header>
      <SideBar onSelect={setCurrentSection} currentSection={currentSection} />
      <main className="content">
        {currentSection === 'services' && <ServiceView />}
        {currentSection === 'users' && <BlockUsers />}
        {currentSection === 'twitsnaps' && <TwitSnapsView />}
      </main>
    </div>
  );
};

export default Home;
