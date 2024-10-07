// src/Home.js
import React, { useState } from 'react';
import SideBar from './SideBar';
import ServiceView from './ServiceView';
import BlockUsers from './BlockUsers';
import TwitSnapsView from './TwitSnapsView';
import '../styles/Home.css';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('services');

  return (
    <div className="home-container">
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
