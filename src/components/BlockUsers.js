import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../handlers/ProfileHandler';
import { blockUser, unblockUser, getEmailByUsername, getUsersStatus, getStatusByEmail } from '../handlers/BlockUserHandler';
import '../styles/BlockUsers.css';

// Caché para almacenar los usuarios temporalmente
let usersCache = null;

const BlockUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState({}); // Estado de carga por usuario
  const [error, setError] = useState(null);

  // Función fetchUsers con caché
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
          email: email,
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
    setLoadingUsers((prevState) => ({ ...prevState, [user.email]: true })); // Muestra el loading para este usuario

    const action = user.isBlocked ? unblockUser : blockUser;
    const result = await action(user.email);

    if (result.success) {
      // Actualiza el estado del usuario localmente
      setUsers((prevUsers) => 
        prevUsers.map((u) => 
          u.email === user.email ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );
      usersCache = null; // Invalida la caché
    } else {
      setError(result.message);
    }

    setLoadingUsers((prevState) => ({ ...prevState, [user.email]: false })); // Oculta el loading para este usuario
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
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isBlocked ? 'Bloqueado' : 'Activo'}</td>
              <td>
                <button onClick={() => toggleUserBlock(user)} disabled={loadingUsers[user.email]}>
                  {loadingUsers[user.email] ? 'Procesando...' : (user.isBlocked ? 'Desbloquear' : 'Bloquear')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default BlockUsers;
