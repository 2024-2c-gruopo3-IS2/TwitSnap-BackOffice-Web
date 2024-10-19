import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../styles/ProfileView.css'; // Asegúrate de que la ruta sea correcta

const ProfileView = ({ email, onLogout }) => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogout = () => {
    // Aquí puedes llamar a la función onLogout si necesitas realizar algún cierre de sesión.
    if (onLogout) {
      onLogout(); // Llama a la función de cierre de sesión
    }
    // Redirige a la pantalla de registro
    navigate('/login'); // Redirige a la pantalla de registro
  };

  return (
    <div className="profile-view">
      <h2>Perfil</h2>
      <p>Email: {email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default ProfileView;
