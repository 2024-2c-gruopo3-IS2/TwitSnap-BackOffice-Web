// src/components/Home.js

import React, { useState } from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar'; 
import ServiceView from './ServiceView';
import BlockUsers from './BlockUsers';
import TwitSnapsView from './TwitSnapsView';
import ProfileView from './ProfileView';
import VerificationView from './VerificationView';
import Metrics from './Metrics';
import '../styles/Home.css';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('services');
  const userEmail = localStorage.getItem('email');

  const handleLogout = () => {
    console.log("Cerrando sesión");
  };

  const handleProfileClick = () => {
    setCurrentSection('profile');
  };

  return (
    <div className="home-container">
      <TopBar onProfileClick={handleProfileClick} /> 
      <SideBar onSelect={setCurrentSection} currentSection={currentSection} />
      <main className="content">
        {currentSection === 'services' && <ServiceView />}
        {currentSection === 'users' && <BlockUsers />}
        {currentSection === 'twitsnaps' && <TwitSnapsView />}
        {currentSection === 'verification' && <VerificationView />}
        {currentSection === 'metrics' && <Metrics />}
        {currentSection === 'profile' && (
          <ProfileView email={userEmail} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
};

export default Home;
