import React, { useEffect, useState } from 'react';
import { getAllUsers, getProfileByUsername } from '../handlers/ProfileHandler';
import '../styles/VerificationView.css';

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
      const profileResult = await getProfileByUsername(username);
      return {
        username,
        name: profileResult.profile.name,
        surname: profileResult.profile.surname,
        isVerified: profileResult.profile.is_verified,
      };
    });

    try {
      const profilesWithDetails = await Promise.all(profilePromises);
      setProfiles(profilesWithDetails);
      profilesCache = profilesWithDetails;
      setFilteredProfiles(profilesWithDetails);
    } catch (err) {
      setError('Error al obtener los perfiles');
    }

    setLoading(false);
  };

  useEffect(() => {
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
                          alt="ID Anverso"
                          className="clickable-image"
                        />
                        <p>ID (Anverso)</p>
                      </div>
                      <div onClick={() => openModal("https://cdn2.iconfinder.com/data/icons/ecommerce-206/33/member-256.png")}>
                        <img
                          src="https://cdn2.iconfinder.com/data/icons/ecommerce-206/33/member-256.png"
                          alt="ID Reverso"
                          className="clickable-image"
                        />
                        <p>ID (Reverso)</p>
                      </div>
                      <div onClick={() => openModal("https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1")}>
                        <img
                          src="https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1"
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
