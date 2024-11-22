import React, { useEffect, useState } from 'react';
import { getAllUsers, getProfileByUsername, verifyProfile } from '../handlers/ProfileHandler';
import '../styles/VerificationView.css';
import { storage } from '../firebase.config';
import { ref, getDownloadURL } from 'firebase/storage';

const StatusIndicator = ({ isVerified, id}) => {
  // Definir el color según las condiciones:
  let statusColor = '#F44336'; // Rojo por defecto

  if (isVerified && id) {
    statusColor = '#4CAF50'; // Verde si está verificado y tiene toda la documentación
  } else if ((id) && !isVerified) {
    statusColor = '#FF9800'; // Naranja si tiene la documentación pero no está verificado
  }

  return (
    <span
      style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: statusColor,
        marginRight: '5px',
      }}
    />
  );
};

const VerificationView = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchId = async (username) => {
    try {
      const imageRef = ref(storage, `documents/id_${username}.png`);
      const url = await getDownloadURL(imageRef);
      console.log('URL:', url);
      return url;
    } catch (error) {
      return ""; 
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const usernames = await getAllUsers();
  
    
      const profilePromises = usernames.data.map(async (username) => {
        try {
          const profileResult = await getProfileByUsername(username);
          const id = await fetchId(username);
          return {
            username,
            name: profileResult.profile.name,
            surname: profileResult.profile.surname,
            isVerified: profileResult.profile.is_verified,
            id: id,
          };
        } catch (err) {
          console.error("Error fetching profile for", username, err);
          return null; 
        }
      });
    
      try {
        const profilesWithDetails = await Promise.all(profilePromises);
        const validProfiles = profilesWithDetails.filter(profile => profile !== null);
        setProfiles(validProfiles);
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
      const matchesSearch = profile.username.toLowerCase().includes(searchTerm.toLowerCase());
  
      if (filterStatus === "verified") {
        return profile.isVerified && profile.id && matchesSearch;
      } else if (filterStatus === "with-docs") {
        return (
          !profile.isVerified &&
          profile.id &&
          matchesSearch
        );
      } else if (filterStatus === "without-docs") {
        return (
          !profile.isVerified &&
          (!profile.id) &&
          matchesSearch
        );
      }
      return matchesSearch; // Sin filtro, retorna todos
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
              <option value="verified">Usuarios Verificados</option>
              <option value="with-docs">Usuarios Pendientes</option>
              <option value="without-docs">Usuarios No Verificados</option>
            </select>
            </div>
          </div>
  
          <div className="user-list">
            {filteredProfiles.map((profile) => (
              <div key={profile.username} className="user-item">
                <div className="user-summary" onClick={() => toggleExpand(profile.username)}>
                  <div>
                    <StatusIndicator isVerified={profile.isVerified} id={profile.id} />
                    <strong>{profile.username}</strong> - Apellido: {profile.surname} - Nombre: {profile.name}
                  </div>
                </div>
                {expandedUser === profile.username && (
                  <div className="user-details">
                    <p><strong>Nombre:</strong> {profile.name}</p>
                    <p><strong>Apellido:</strong> {profile.surname}</p>
                    {!profile.isVerified && !profile.id ?(
                      <>
                        <p>El usuario no ha enviado la documentación aún.</p>
                      </>
                    ) : (
                      profile.isVerified && profile.id ? (
                        <>
                          <p>Usuario verificado correctamente.</p>
                          <div className="validation-media">
                            <div className="validation-images">
                              <div onClick={() => openModal(profile.id)}>
                                <img
                                  src={profile.id}
                                  alt="Selfie"
                                  className="clickable-image"
                                />
                                <p>Identificación</p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>El usuario ha enviado la documentación pero no ha sido verificado.</p>

                          <div className="validation-media">
                            <div className="validation-images">
                              <div onClick={() => openModal(profile.id)}>
                                <img
                                  src={profile.id}
                                  alt="Id"
                                  className="clickable-image"
                                />
                                <p>Identificación</p>
                              </div>
                            </div>
                          </div>

                          <div className="validation-actions">
                            <button
                              className="validate-btn"
                              onClick={async () => {
                                const result = await verifyProfile(profile.username);
                                if (result.success) {
                                  alert(result.message); // Mostrar mensaje de éxito
                                  setProfiles((prevProfiles) =>
                                    prevProfiles.map((p) =>
                                      p.username === profile.username
                                        ? { ...p, isVerified: true } // Actualizar el estado local del perfil
                                        : p
                                    )
                                  );
                                } else {
                                  alert(`Error: ${result.message}`); // Mostrar mensaje de error
                                }
                              }}
                            >
                              Validar
                            </button>
                          </div>
                        </>
                      )
                    )}
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
