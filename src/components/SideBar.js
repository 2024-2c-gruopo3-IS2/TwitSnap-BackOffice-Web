// src/SideBar.js
import React from 'react';
import '../styles/SideBar.css';
import servicesLogo from '../assets/images/services_icon.png';
import usersLogo from '../assets/images/block_users_icon.png';
import twitSnapsLogo from '../assets/images/twitsnaps_icon.png';
import verificationLogo from '../assets/images/verification_icon.png';
import metricsLogo from '../assets/images/metrics_icon.png';

const SideBar = ({ onSelect, currentSection }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <div className={`sidebar-item ${currentSection === 'services' ? 'active' : ''}`}>
              <a href="#" onClick={() => onSelect('services')}>
                <img src={servicesLogo} alt="Services" className="sidebar-logo" />
                Servicios
              </a>
            </div>
          </li>
          <li>
            <div className={`sidebar-item ${currentSection === 'users' ? 'active' : ''}`}>
              <a href="#" onClick={() => onSelect('users')}>
                <img src={usersLogo} alt="Manage Users" className="sidebar-logo" />
                Bloquear Usuarios
              </a>
            </div>
          </li>
          <li>
            <div className={`sidebar-item ${currentSection === 'verification' ? 'active' : ''}`}>
              <a href="#" onClick={() => onSelect('verification')}>
                <img src={verificationLogo} alt="Verification" className="sidebar-logo" />
                Verificar Usuarios
              </a>
            </div>
          </li>
          <li>
            <div className={`sidebar-item ${currentSection === 'twitsnaps' ? 'active' : ''}`}>
              <a href="#" onClick={() => onSelect('twitsnaps')}>
                <img src={twitSnapsLogo} alt="TwitSnaps" className="sidebar-logo" />
                TwitSnaps
              </a>
            </div>
          </li>
          <li>
            <div className={`sidebar-item ${currentSection === 'metrics' ? 'active' : ''}`}>
              <a href="#" onClick={() => onSelect('metrics')}>
                <img src={metricsLogo} alt="Metrics" className="sidebar-logo" />
                Métricas
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
