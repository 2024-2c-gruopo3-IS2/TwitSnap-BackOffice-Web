import React, { useState } from 'react';
import SideBar from './SideBar';
import ServiceView from './ServiceView';
import BlockUsers from './BlockUsers';
import TwitSnapsView from './TwitSnapsView';
import ProfileView from './ProfileView'; // Asegúrate de importar el nuevo componente
import logo from '../assets/images/logo.png';
import '../styles/Home.css';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('services');
  const userEmail = localStorage.getItem('email'); 

  const handleLogout = () => {
    // Lógica de cierre de sesión aquí
    console.log("Cerrando sesión");
    // Puedes agregar más lógica aquí, como redirigir al usuario
  };

  const handleProfileClick = () => {
    setCurrentSection('profile'); // Cambia a la sección de perfil
  };

  return (
    <div className="home-container">
      <header className="top-bar">
        <div className="logo">
          <img src={logo} className="logo-image" alt="Custom Logo" />
          <span>TwitSnap BackOffice</span>
        </div>
        <div className="profile" onClick={handleProfileClick}>
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
        {currentSection === 'profile' && (
          <ProfileView email={userEmail} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
};

export default Home;
