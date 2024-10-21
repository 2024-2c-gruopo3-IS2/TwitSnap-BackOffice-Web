import React, { useEffect, useState } from 'react';
import '../styles/UserDetailsModal.css';
import { getProfileByUsername } from '../handlers/ProfileHandler';

const UserDetailsModal = ({ user, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await getProfileByUsername(user.username);
                if (result.success) {
                    setProfile(result.profile);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Error al obtener el perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user.username]); // Dependencia en el username para volver a ejecutar si cambia

    if (loading) {
        return <div></div>; // Mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Mensaje de error
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Detalles del Usuario</h2>
                <p><strong>Nombre de Usuario:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Estado:</strong> {user.isBlocked ? 'Bloqueado' : 'Activo'}</p>
                <p><strong>Nombre:</strong> {profile.name} {profile.surname}</p>
                <p><strong>Descripción:</strong> {profile.description}</p>
                <p><strong>Fecha de Nacimiento:</strong> {profile.date_of_birth}</p>
                <p><strong>Ubicación:</strong> {profile.location}</p>
                <p><strong>Intereses:</strong> {profile.interests.join(', ')}</p>
            </div>
        </div>
    );
};

export default UserDetailsModal;
