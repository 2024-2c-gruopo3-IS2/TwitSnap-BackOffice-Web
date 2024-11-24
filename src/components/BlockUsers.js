import React, { useEffect, useState } from 'react';
import { getAllUsers, getProfileByUsername } from '../handlers/ProfileHandler';
import { blockUser, unblockUser,getBlockedUsers} from '../handlers/BlockUserHandler';
import '../styles/BlockUsers.css';
import userDetailsImage from '../assets/images/moreDetails.png'; 
import UserDetailsModal from './UserDetailsModal'; 
import BlockUsersModal from './BlockUsersModal';


// Caché para almacenar los usuarios temporalmente
let usersCache = null;

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
  const [loading, setLoading] = useState(true); // Estado de carga general
  const [loadingUsers, setLoadingUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true); // Mostrar círculo de carga
    if (usersCache) {
      setUsers(usersCache);
      setLoading(false); 
      return;
    }

    const resultUsers = await getAllUsers();
    const blockedUsers = await getBlockedUsers();
    const blockedEmails = blockedUsers.data.map((user) => user.email);

    const users = await Promise.all(
      resultUsers.data.map(async (user) => {
        const profile = await getProfileByUsername(user);
        return { username: profile.profile.username, email: profile.profile.email, isBlocked: blockedEmails.includes(profile.profile.email) };
      })
    );

    console.log('Users:', users);
    console.log('Blocked emails:', blockedEmails);

    setUsers(users);
    setBlockedEmails(blockedEmails);

    setLoading(false); // Ocultar círculo de carga
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
  }

  const closeBlockModal = () => {
    setSelectedUser(null);
    setIsBlockModalOpen(false);
    fetchUsers();
  }
  
  const handleBlockOrUnblock = async (user) => {
    setLoadingUsers((prevState) => ({ ...prevState, [user.email]: true }));
  
    try {
      if (user.isBlocked) {
        // Desbloquear usuario
        await unblockUser(user.email);
        fetchUsers(); // Refrescar lista de usuarios
      } else {
        // Bloquear usuario (abrir modal para confirmar)
        openBlockModal(user);
      }
  
    } catch (error) {
      console.error("Error al bloquear/desbloquear usuario:", error);
    } finally {
      setLoadingUsers((prevState) => ({ ...prevState, [user.email]: false }));
    }
  };
  

  return (
    <section className="section">
      <h2>Administrar Usuarios</h2>

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
                      disabled={loadingUsers[user.email]}
                      style={{
                        backgroundColor: user.isBlocked ? "#4CAF50" : "#F44336",
                        color: "white",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {loadingUsers[user.email]
                        ? "Procesando..."
                        : user.isBlocked
                        ? "Desbloquear"
                        : "Bloquear"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => openModal(user)} className="details-button">
                      <img
                        src={userDetailsImage}
                        alt="Detalles"
                        className="details-image"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedUser && (
            <UserDetailsModal user={selectedUser} onClose={closeModal} />
          )}

          {isBlockModalOpen && selectedUser && (
            <BlockUsersModal
              user={selectedUser}
              onClose={closeBlockModal}
              onBlock={async () => {
                await fetchUsers(); // Refrescar usuarios tras bloqueo
                closeBlockModal(); // Cerrar modal
              }}
            />
          )}
        </>
      )}
    </section>
  );
};

export default BlockUsers;