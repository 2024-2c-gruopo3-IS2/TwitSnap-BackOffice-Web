import React, { useState } from 'react';
import '../styles/BlockUsersModal.css'; // Asegúrate de crear este archivo para los estilos
import { blockUser } from '../handlers/BlockUserHandler';

const BlockUsersModal = ({ user, onClose }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [blockDays, setBlockDays] = useState(2); // Valor inicial: 2 días

  const reasons = [
    "Spam",
    "Lenguaje ofensivo",
    "Acoso",
    "Publicación de contenido inapropiado",
    "Cuenta falsa",
    "Suplantación de identidad",
    "Incitación al odio",
    "Violación de normas de privacidad",
    "Actividad sospechosa",
    "Otros",
  ];

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Por favor, selecciona una razón para el bloqueo.");
      return;
    }
    blockUser(user.email, selectedReason, blockDays);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Bloquear Usuario</h2>
        <p>
          Estás a punto de bloquear a <strong>{user.username}</strong>. Por favor, selecciona una razón y elige la duración del bloqueo.
        </p>

        <div className="reasons-container">
          <h3>Razones para el bloqueo:</h3>
          <ul>
            {reasons.map((reason, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => handleReasonChange(reason)}
                  />
                  {reason}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="days-selector">
          <h3>Días de bloqueo:</h3>
          <input
            type="range"
            min="2"
            max="14"
            value={blockDays}
            onChange={(e) => setBlockDays(Number(e.target.value))}
          />
          <span>{blockDays} días</span>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="confirm-button">
            Confirmar
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUsersModal;
