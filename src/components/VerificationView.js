import React, { useEffect, useState } from 'react';
import { getAllUsers, getProfileByUsername } from '../handlers/ProfileHandler';
import '../styles/VerificationView.css';
import {  getStorage, ref, getDownloadURL } from 'firebase/storage';

let profilesCache = null;

const StatusIndicator = ({ isVerified }) => (
  <span
    style={{
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isVerified ? '#4CAF50' : '#F44336',
      marginRight: '5px',
    }}
  />
);

const VerificationView = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchProfileImage = async (username) => {
    try {
      const storage = getStorage(); // Obtén la instancia de Firebase Storage
      const imageRef = ref(storage, `documents/${username}.png`); // Usa el path correcto dentro de Storage
      const url = await getDownloadURL(imageRef); // Obtén la URL de la imagen
  
      console.log(url); // Verifica que la URL se está obteniendo correctamente
      return url;
    } catch (error) {
      console.log('Error fetching image:', error);
      return "https://static-00.iconduck.com/assets.00/profile-user-icon-2048x2048-m41rxkoe.png"; // URL por defecto si no se encuentra la imagen
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const usernames = await getAllUsers();
    
      if (profilesCache) {
        setProfiles(profilesCache);
        setFilteredProfiles(profilesCache);
        setLoading(false);
        return;
      }
    
      const profilePromises = usernames.data.map(async (username) => {
        try {
          const profileResult = await getProfileByUsername(username);
          return {
            username,
            name: profileResult.profile.name,
            surname: profileResult.profile.surname,
            isVerified: profileResult.profile.is_verified,
            selfie: await fetchProfileImage(username),
          };
        } catch (err) {
          console.error("Error fetching profile for", username, err);
          return null; // Manejo de errores
        }
      });
    
      try {
        const profilesWithDetails = await Promise.all(profilePromises);
        // Filtrar perfiles nulos en caso de errores
        const validProfiles = profilesWithDetails.filter(profile => profile !== null);
        setProfiles(validProfiles);
        profilesCache = validProfiles;
        setFilteredProfiles(validProfiles);
      } catch (err) {
        setError('Error al obtener los perfiles');
      }
    
      setLoading(false);
    };    

    fetchProfiles();
  }, []);

  const toggleExpand = (username) => {
    setExpandedUser(expandedUser === username ? null : username);
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  useEffect(() => {
    const filtered = profiles.filter((profile) => {
      const isVerifiedMatch = filterStatus ? profile.isVerified.toString() === filterStatus : true;
      const usernameMatch = profile.username.toLowerCase().includes(searchTerm.toLowerCase());

      return isVerifiedMatch && usernameMatch;
    });

    setFilteredProfiles(filtered);
  }, [searchTerm, filterStatus, profiles]);

  return (
    <section className="section">
      <h2>Verificación de Usuarios</h2>

      {loading && (
        <div className="loading-container">
          <div className="loading-circle"></div>
        </div>
      )}

      {!loading && (
        <>
          <div className="search-bar">
            <img
                src="https://www.citypng.com/public/uploads/preview/magnifying-glass-search-white-icon-transparent-png-701751694974238f0vl5bmpat.png"
                alt="Lupa"
                className="verification-search-icon-img"
              />
            <input
              type="text"
              placeholder="Buscar por nombre de usuario..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="verification-select-container">
              <select
                className="styled-select"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="true">Validados</option>
                <option value="false">No validados</option>
              </select>
            </div>
          </div>

          <div className="user-list">
            {filteredProfiles.map((profile) => (
              <div key={profile.username} className="user-item">
                <div className="user-summary" onClick={() => toggleExpand(profile.username)}>
                  <div>
                    <StatusIndicator isVerified={profile.isVerified} />
                    <strong>{profile.username}</strong> - Apellido: {profile.surname} - Nombre: {profile.name}
                  </div>
                </div>
                {expandedUser === profile.username && (
                  <div className="user-details">
                    <p><strong>Nombre:</strong> {profile.name}</p>
                    <p><strong>Apellido:</strong> {profile.surname}</p>
                    <div className="validation-media">
                      <div onClick={() => openModal("https://cdn4.iconfinder.com/data/icons/car-misc/100/Driver_license-256.png")}>
                        <img
                          src="https://cdn4.iconfinder.com/data/icons/car-misc/100/Driver_license-256.png"
                          alt="DNI Anverso"
                          className="clickable-image"
                        />
                        <p>DNI (Anverso)</p>
                      </div>
                      <div onClick={() => openModal("https://cdn2.iconfinder.com/data/icons/ecommerce-206/33/member-256.png")}>
                        <img
                          src="https://cdn2.iconfinder.com/data/icons/ecommerce-206/33/member-256.png"
                          alt="DNI Reverso"
                          className="clickable-image"
                        />
                        <p>DNI (Reverso)</p>
                      </div>
                      <div onClick={() => openModal(profile.selfie)}>
                        <img
                          src={profile.selfie}
                          alt="Selfie"
                          className="clickable-image"
                        />
                        <p>Selfie</p>
                      </div>
                    </div>
                    <div className="validation-actions">
                      <button className="validate-btn">Validar</button>
                      <button className="reject-btn">Rechazar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {error && <p>{error}</p>}

      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Vista completa" />
          </div>
        </div>
      )}
    </section>
  );
};

export default VerificationView;
