// src/BlockUsers.js
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../handlers/ProfileHandler'; // Asegúrate de importar la función
import { blockUser, unblockUser } from '../handlers/BlockUserHandler'; // Importa las funciones para bloquear/desbloquear
import '../styles/BlockUsers.css'; // Asegúrate de tener este archivo de estilos

const BlockUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        console.log("Usuarios antes de ser cargados:", result.users)
        setUsers(result.users);
        console.log("Usuarios cargados: ", users);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const toggleUserBlock = async (user) => {
    const action = user.isBlocked ? unblockUser : blockUser;
    const result = await action(user.email);
    
    if (result.success) {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
      ));
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
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
            <th>User Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button onClick={() => toggleUserBlock(user)}>
                  {user.isBlocked ? 'Unblock' : 'Block'}
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
