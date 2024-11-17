import React, { useEffect, useState } from 'react';
import { getAllUsers, getProfileByUsername } from '../handlers/ProfileHandler'; 
import '../styles/VerificationView.css';
import UserDetailsModal from './UserDetailsModal'; 

// Caché para almacenar los perfiles de usuario temporalmente
let profilesCache = null;

// Componente para el indicador de estado
const StatusIndicator = ({ isVerified }) => (
  <span
    style={{
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isVerified ? '#4CAF50' : '#F44336', // Verde si es verificado, rojo si no
      marginRight: '5px',
    }}
  />
);

const VerificationView = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga general
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const fetchProfiles = async () => {
    setLoading(true); // Mostrar círculo de carga
    const usernames = await getAllUsers();

    if (profilesCache) {
      setProfiles(profilesCache);
      setLoading(false); 
      return;
    }

    const profilePromises = usernames.data.map(async (username) => {
      const profileResult = await getProfileByUsername(username);

      return {
        username,
        name: profileResult.profile.name, // Nombre del usuario
        surname: profileResult.profile.surname, // Apellido del usuario
        isVerified: profileResult.profile.is_verified, // Verificación del usuario
      };
    });

    try {
      const profilesWithDetails = await Promise.all(profilePromises);
      setProfiles(profilesWithDetails);
      profilesCache = profilesWithDetails;
    } catch (err) {
      setError('Error al obtener los perfiles');
    }

    setLoading(false); // Ocultar círculo de carga
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <section className="section">
      <h2>Verificación de Usuarios</h2>

      {loading && (
        <div className="loading-container">
          <div className="loading-circle"></div> {/* Círculo de carga */}
        </div>
      )}

      {!loading && (
        <>
          <table>
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Verificado</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.username}>
                  <td>{profile.username}</td>
                  <td>{profile.surname}</td>
                  <td>{profile.name}</td>
                  <td>
                    <StatusIndicator isVerified={profile.isVerified} />
                    {profile.isVerified ? 'Sí' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedUser && (
            <UserDetailsModal user={selectedUser} onClose={closeModal} />
          )}
        </>
      )}

      {error && <p>{error}</p>}
    </section>
  );
};

export default VerificationView;
