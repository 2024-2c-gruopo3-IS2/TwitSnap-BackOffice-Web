import React, { useEffect, useState } from 'react';
import { getAllUsers, getEmailByUsername } from '../handlers/ProfileHandler';
import { blockUser, unblockUser, getUsersStatus, getStatusByEmail } from '../handlers/BlockUserHandler';
import '../styles/BlockUsers.css';
import userDetailsImage from '../assets/images/moreDetails.png'; 
import UserDetailsModal from './UserDetailsModal'; 

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
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState({});
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal

  const fetchUsers = async () => {
    if (usersCache) {
      console.log("Using cached users data");
      setUsers(usersCache);
      setLoading(false);
      return;
    }

    const resultUsers = await getAllUsers();
    const resultStatus = await getUsersStatus();

    if (resultUsers.success && resultStatus.success) {
      const userPromises = resultUsers.data.map(async (username) => {
        const email = await getEmailByUsername(username);
        const statusResult = await getStatusByEmail(email, resultStatus.users);

        return {
          username,
          email,
          isBlocked: statusResult.success ? statusResult.status : true,
        };
      });

      const usersWithDetails = await Promise.all(userPromises);
      setUsers(usersWithDetails);
      usersCache = usersWithDetails;
    } else {
      setError(resultUsers.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserBlock = async (user) => {
    setLoadingUsers((prevState) => ({ ...prevState, [user.email]: true }));

    const action = user.isBlocked ? unblockUser : blockUser;
    const result = await action(user.email);

    if (result.success) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === user.email ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
      usersCache = null; // Invalida la caché
    } else {
      setError(result.message);
    }

    setLoadingUsers((prevState) => ({ ...prevState, [user.email]: false }));
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Cargando Usuarios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="section">
      <h2>Administrar Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acción</th>
            <th>Detalles</th> {/* Nueva columna de detalles */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <StatusIndicator isBlocked={user.isBlocked} />
                {user.isBlocked ? 'Bloqueado' : 'Activo'}
              </td>
              <td>
                <button
                  onClick={() => toggleUserBlock(user)}
                  disabled={loadingUsers[user.email]}
                  style={{
                    backgroundColor: user.isBlocked ? '#4CAF50' : '#F44336',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {loadingUsers[user.email]
                    ? 'Procesando...'
                    : user.isBlocked
                    ? 'Desbloquear'
                    : 'Bloquear'}
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
    </section>
  );
};

export default BlockUsers;
