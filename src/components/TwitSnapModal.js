import React from 'react';
import '../styles/TwitSnapModal.css';  // Asegúrate de agregar estilos para el modal

const TwitSnapModal = ({ children, onClose }) => {
  return (
    <div className="twitsnap-modal-overlay">
      <div className="twitsnap-modal-content">
        <button className="twitsnap-modal-close" onClick={onClose}>
          <img 
            src="https://cdn0.iconfinder.com/data/icons/round-ui-icons/512/close_red.png" 
            alt="Cerrar"
            className="twitsnap-close-icon"
          />
        </button>
        {children}
      </div>
    </div>
  );
};

export default TwitSnapModal;
