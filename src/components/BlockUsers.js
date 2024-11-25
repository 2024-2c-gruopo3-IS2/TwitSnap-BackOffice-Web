import React, { useEffect, useState, useRef } from 'react';
import { getAllUsers, getProfileByUsername } from '../handlers/ProfileHandler';
import { blockUser, unblockUser, getBlockedUsers } from '../handlers/BlockUserHandler';
import '../styles/BlockUsers.css';
import userDetailsImage from '../assets/images/moreDetails.png';
import UserDetailsModal from './UserDetailsModal';

const StatusIndicator = ({ isBlocked }) => (
  <span
    style={{
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: isBlocked ? '#F44336' : '#4CAF50',
      marginRight: '5px',
    }}
  />
);

const BlockUsers = () => {
  const [users, setUsers] = useState([]);
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [loadingState, setLoadingState] = useState({
    general: true,
    specific: {},
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [blockDays, setBlockDays] = useState(2); // Días por defecto

  const isFetching = useRef(false); // Para evitar duplicar llamadas
  const cacheRef = useRef(null); // Caché de usuarios

  const setLoadingForUser = (email, isLoading) => {
    setLoadingState((prev) => ({
      ...prev,
      specific: {
        ...prev.specific,
        [email]: isLoading,
      },
    }));
  };

  // Función para cargar los usuarios al iniciar
  const fetchUsers = async () => {
    if (isFetching.current) return; // Evitar múltiples solicitudes simultáneas
    isFetching.current = true;
    setLoadingState((prev) => ({ ...prev, general: true }));

    if (cacheRef.current) {
      setUsers(cacheRef.current);
      setLoadingState((prev) => ({ ...prev, general: false }));
      isFetching.current = false;
      return;
    }

    try {
      const resultUsers = await getAllUsers();
      const blockedUsers = await getBlockedUsers();
      const blockedEmails = blockedUsers.data.map((user) => user.email);

      const users = await Promise.all(
        resultUsers.data.map(async (user) => {
          const profile = await getProfileByUsername(user);
          return {
            username: profile.profile.username,
            email: profile.profile.email,
            isBlocked: blockedEmails.includes(profile.profile.email),
          };
        })
      );

      cacheRef.current = users; // Guardar usuarios en caché
      setUsers(users);
      setBlockedEmails(blockedEmails);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setLoadingState((prev) => ({ ...prev, general: false }));
      isFetching.current = false;
    }
  };

  // Función para actualizar los usuarios luego de bloquear/desbloquear
  const updateUsers = async () => {
    try {
      const blockedUsers = await getBlockedUsers();
      const blockedEmails = blockedUsers.data.map((user) => user.email);

      setBlockedEmails(blockedEmails);
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isBlocked: blockedEmails.includes(user.email),
        }))
      );
    } catch (error) {
      console.error('Error al actualizar los usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
    setSelectedReason(null); // Reiniciar selección
    setBlockDays(2); // Restablecer días
  };

  const closeBlockModal = () => {
    setSelectedUser(null);
    setIsBlockModalOpen(false);
  };

  const handleBlockOrUnblock = async (user) => {
    if (user.isBlocked) {
      setLoadingForUser(user.email, true);
      try {
        await unblockUser(user.email);
        await updateUsers(); // Actualiza la lista de usuarios después de desbloquear
      } catch (error) {
        console.error('Error al desbloquear usuario:', error);
      } finally {
        setLoadingForUser(user.email, false);
      }
    } else {
      openBlockModal(user); // Mostrar modal de confirmación para bloquear
    }
  };

  const handleConfirmBlock = async () => {
    if (!selectedReason) {
      alert('Por favor, selecciona una razón para el bloqueo.');
      return;
    }

    setLoadingForUser(selectedUser.email, true);
    try {
      await blockUser(selectedUser.email, selectedReason, blockDays);
      await updateUsers(); // Actualiza la lista de usuarios después de bloquear
    } finally {
      setLoadingForUser(selectedUser.email, false);
      closeBlockModal();
    }
  };

  return (
    <section className="section">
      <h2>Administrar Usuarios</h2>

      {loadingState.general && (
        <div className="loading-container">
          <div className="loading-circle"></div> {/* Círculo de carga */}
        </div>
      )}

      {!loadingState.general && (
        <>
          <table>
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acción</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <StatusIndicator isBlocked={blockedEmails.includes(user.email)} />
                    {user.isBlocked ? 'Bloqueado' : 'Activo'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleBlockOrUnblock(user)}
                      disabled={loadingState.specific[user.email]}
                      className={`action-button ${user.isBlocked ? 'unblock' : 'block'}`}
                    >
                      {loadingState.specific[user.email]
                        ? 'Procesando...'
                        : user.isBlocked
                        ? 'Desbloquear'
                        : 'Bloquear'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => openModal(user)} className="details-button">
                      <img src={userDetailsImage} alt="Detalles" className="details-image" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedUser && (
            <UserDetailsModal user={selectedUser} onClose={closeModal} />
          )}

          {isBlockModalOpen && (
            <div className="blockUserModal">
              <div className="blockUserModal-content">
                <span
                  className="blockUserModal-close"
                  onClick={closeBlockModal}
                >
                  &times;
                </span>
                <h2>Bloquear a <strong>{selectedUser.username}</strong></h2>          
                <div className="reasons-container">
                  <h3>Selelccione una razón para el bloqueo</h3>
                  <ul>
                    {[
                      'Spam',
                      'Lenguaje ofensivo',
                      'Acoso',
                      'Publicación de contenido inapropiado',
                      'Cuenta falsa',
                      'Suplantación de identidad',
                      'Incitación al odio',
                      'Violación de normas de privacidad',
                      'Actividad sospechosa',
                      'Otros',
                    ].map((reason, index) => (
                      <li key={index}>
                        <label>
                          <input
                            type="radio"
                            name="reason"
                            value={reason}
                            checked={selectedReason === reason}
                            onChange={() => setSelectedReason(reason)}
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
                  <button onClick={handleConfirmBlock} className="confirm-button">
                    Confirmar
                  </button>
                  <button onClick={closeBlockModal} className="cancel-button">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BlockUsers;
