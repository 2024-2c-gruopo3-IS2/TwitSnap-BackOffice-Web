import React, { useState, useEffect } from 'react';
import { fetchAllSnaps } from '../handlers/TwitSnapsHandler';
import '../styles/TwitSnapsView.css';
import TwitSnapModal from './TwitSnapModal'; 
import moreDetailsImage from '../assets/images/moreDetails.png'; 

const TwitSnapsView = () => {
  const [twitSnaps, setTwitSnaps] = useState([]);
  const [filteredSnaps, setFilteredSnaps] = useState([]);
  const [filterType, setFilterType] = useState('message');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSnap, setSelectedSnap] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);  

  useEffect(() => {
    const cachedSnaps = localStorage.getItem('twitSnaps');
    
    if (cachedSnaps) {
      // Si hay datos en caché, los usa
      setTwitSnaps(JSON.parse(cachedSnaps));
      setFilteredSnaps(JSON.parse(cachedSnaps));
      setLoading(false);
    } else {
      // Si no hay caché, llama a la API
      const getSnaps = async () => {
        setLoading(true);
        const result = await fetchAllSnaps();
        if (result.success) {
          setTwitSnaps(result.snaps);
          setFilteredSnaps(result.snaps);
          // Guarda los datos en caché
          localStorage.setItem('twitSnaps', JSON.stringify(result.snaps));
        } else {
          setError(result.message);
        }
        setLoading(false);
      };

      getSnaps();
    }
  }, []);

  useEffect(() => {
    const filtered = twitSnaps.filter((snap) => {
      const value = snap[filterType]?.toString().toLowerCase() || '';
      return value.includes(searchTerm.toLowerCase());
    });
    setFilteredSnaps(filtered);
  }, [searchTerm, filterType, twitSnaps]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleOpenModal = (snap) => {
    setSelectedSnap(snap);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSnap(null);
  };

  return (
    <section className="section twitsnap-view">
      <h2>Lista de TwitSnaps</h2>

      {loading && <p>Cargando TwitSnaps...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="search-bar">
            <span className="search-icon">
              <img
                src="https://www.citypng.com/public/uploads/preview/magnifying-glass-search-white-icon-transparent-png-701751694974238f0vl5bmpat.png"
                alt="Lupa"
                style={{ width: '25px', height: '25px' }}
              />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Buscar...`}
            />
          </div>

          <div className="filter-buttons">
            <button className={filterType === 'message' ? 'active' : ''} onClick={() => handleFilterChange('message')}>
              Mensaje
            </button>
            <button className={filterType === 'username' ? 'active' : ''} onClick={() => handleFilterChange('username')}>
              Autor
            </button>
            <button className={filterType === 'email' ? 'active' : ''} onClick={() => handleFilterChange('email')}>
              Fecha
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th className="message-col">Mensaje</th>
                <th className="username-col">Autor</th>
                <th className="date-col">Fecha de Creación</th>
                <th className="details-col">Detalles</th> 
              </tr>
            </thead>
            <tbody>
              {filteredSnaps.map((twitSnap) => (
                <tr key={twitSnap._id}>
                  <td className="message-col">{twitSnap.message}</td>
                  <td className="username-col">{twitSnap.username}</td>
                  <td className="date-col">{new Date(twitSnap.created_at).toLocaleString()}</td>
                  <td className="details-col">
                    <button onClick={() => handleOpenModal(twitSnap)}>
                      <img src={moreDetailsImage} alt="Detalles" style={{ width: '40px', height: '40px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedSnap && (
            <TwitSnapModal onClose={handleCloseModal}>
              <h2 style={{ marginBottom: '20px' }}>Detalles del Snap</h2>
              <div className="snap-details">
                <p><strong>Mensaje:</strong></p>
                <p style={{ fontSize: '18px', marginBottom: '15px' }}>{selectedSnap.message}</p>
                <p><strong>Autor:</strong> {selectedSnap.username}</p>
                <p><strong>Email:</strong> {selectedSnap.email}</p>
                <p><strong>Likes:</strong> {selectedSnap.likes}</p>
                <p><strong>Fecha de Creación:</strong> {new Date(selectedSnap.created_at).toLocaleString()}</p>
                <p><strong>Hastags:</strong> {selectedSnap.hashtags}</p>
                <p><strong>Tipo:</strong> {selectedSnap.is_private ? 'Privado' : 'Público'}</p>
              </div>
            </TwitSnapModal>
          )}
        </>
      )}
    </section>
  );
};

export default TwitSnapsView;
