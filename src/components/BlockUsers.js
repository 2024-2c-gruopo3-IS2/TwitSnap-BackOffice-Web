import React, { useEffect, useState } from 'react';
import { getAllUsers, getEmailByUsername } from '../handlers/ProfileHandler';
import { blockUser, unblockUser, getUsersStatus, getStatusByEmail } from '../handlers/BlockUserHandler';
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
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState({});
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockSuccess, setBlockSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
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
    } else {
      setError(resultUsers.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (reason, days) => {
    if (!selectedUser) return;

    setLoadingUsers((prevState) => ({ ...prevState, [selectedUser.email]: true }));

    const result = await blockUser(selectedUser.email, reason, days);

    if (result.success) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === selectedUser.email ? { ...u, isBlocked: true } : u
        )
      );
      setBlockSuccess('Usuario bloqueado con éxito.');
      setTimeout(() => setBlockSuccess(''), 3000); // Oculta el mensaje después de 3 segundos
    } else {
      setError(result.message);
    }

    setLoadingUsers((prevState) => ({ ...prevState, [selectedUser.email]: false }));
    closeModal();
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <section className="section">
      <h2>Administrar Usuarios</h2>

      {loading && (
        <div className="loading-container">
          <div className="loading-circle"></div>
        </div>
      )}

      {!loading && (
        <>
          {blockSuccess && <div className="success-message">{blockSuccess}</div>}
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
                    <StatusIndicator isBlocked={user.isBlocked} />
                    {user.isBlocked ? 'Bloqueado' : 'Activo'}
                  </td>
                  <td>
                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUser(user.email)}
                        disabled={loadingUsers[user.email]}
                        className="block-button unblock"
                      >
                        {loadingUsers[user.email] ? 'Procesando...' : 'Desbloquear'}
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(user)}
                        className="block-button block"
                      >
                        Bloquear
                      </button>
                    )}
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
        </>
      )}

      {isModalOpen && selectedUser && (
        <BlockModal
          user={selectedUser}
          onClose={closeModal}
          onSubmit={handleBlock}
        />
      )}
    </section>
  );
};

const BlockModal = ({ user, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(1);

  const reasons = [
    'Violación de las reglas de la plataforma',
    'Spam y actividades no deseadas',
    'Suplantación de identidad',
    'Amenazas a la seguridad',
    'Contenido ilegal',
    'Incitación al desorden o desobediencia civil',
    'Violaciones repetidas de términos y condiciones',
    'Protección de la comunidad',
    'Acciones automatizadas sospechosas',
    'Requerimientos legales o gubernamentales',
  ];

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit(reason, days);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Bloquear a {user.username}</h3>
        <label>
          Motivo del bloqueo:
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="" disabled>
              Selecciona un motivo
            </option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label>
          Duración (días):
          <input
            type="number"
            min="1"
            max="14"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </label>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="confirm-button">
            Confirmar
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUsers;
