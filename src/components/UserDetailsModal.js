import React, { useEffect, useState } from 'react';
import '../styles/UserDetailsModal.css';
import { getProfileByUsername } from '../handlers/ProfileHandler';
import { getBlockedUsers } from '../handlers/BlockUserHandler';

const UserDetailsModal = ({ user, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blockedUserDetails, setBlockedUserDetails] = useState(null);

    useEffect(() => {
        const fetchProfileAndBlockedUsers = async () => {
            try {
                setLoading(true);

                // Fetch profile
                const profileResult = await getProfileByUsername(user.username);
                if (profileResult.success) {
                    setProfile(profileResult.profile);
                } else {
                    setError(profileResult.message);
                }

                // Fetch blocked users
                const blockedUsersResult = await getBlockedUsers();
                if (blockedUsersResult.success) {
                    const blockedUser = blockedUsersResult.data.find(
                        (blocked) => blocked.email === user.email
                    );
                    if (blockedUser) {
                        setBlockedUserDetails(blockedUser);
                    }
                } else {
                    setError(blockedUsersResult.message);
                }
            } catch (err) {
                setError('Error al obtener datos');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndBlockedUsers();
    }, [user.username, user.email]);

    if (loading) {
        return <div>Cargando...</div>; // Mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Mensaje de error
    }

    return (
        <div className="userDetailsModal">
            <div className="userDetailsModal-content">
                <span className="userDetailsModal-close" onClick={onClose}>
                    &times;
                </span>
                <h2>Detalles del Usuario: {profile.username}</h2>
                
                {blockedUserDetails && (
                    <div className="blockedUserDetails">
                        <h3 className="blockedUserDetails-title">Usuario Bloqueado</h3>
                        <p><strong>Razón:</strong> {blockedUserDetails.reason}</p>
                        <p><strong>Días restantes:</strong> {blockedUserDetails.days}</p>
                    </div>
                )}
                
                <p><strong>Nombre de Usuario:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Estado:</strong> {blockedUserDetails ? 'Bloqueado' : 'Activo'}</p>
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