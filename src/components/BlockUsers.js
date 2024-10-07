// src/BlockUsers.js
import React, { useState } from 'react';
import '../styles/BlockUsers.css'; // Asegúrate de tener este archivo de estilos

const BlockUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', isBlocked: false },
    { id: 2, name: 'Jane Smith', isBlocked: true }
  ]);

  const toggleUserBlock = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
    ));
  };

  return (
    <section className="section">
      <h2>Manage Users</h2>
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
              <td>{user.name}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button onClick={() => toggleUserBlock(user.id)}>
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
