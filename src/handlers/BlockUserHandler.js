// src/BlockUserHandler.js

const API_BASE_URL = 'https://auth-microservice-vvr6.onrender.com'; // Asegúrate de que esta URL sea la correcta para tu API
const API_PROFILE_URL = 'https://profile-microservice.onrender.com'; // Asegúrate de que esta URL sea la correcta para tu API

export const blockUser = async (email) => {
    try {
        console.log('Blocking user:', email);
        const response = await fetch(`${API_BASE_URL}/auth/block-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        console.log('Response:', response); // Imprime la respuesta

        if (!response.ok || !(await response.json()).message === 'user successfully blocked') {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to block user');
        }

        return { success: true, message: 'User blocked successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const unblockUser = async (email) => {
    try {
        console.log('Unblocking user:', email);
        const response = await fetch(`${API_BASE_URL}/auth/unblock-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        console.log('Response:', response); // Imprime la respuesta

        if (!response.ok || !(await response.json()).message === 'user successfully unblocked') {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to unblock user');
        }

        return { success: true, message: 'User unblocked successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getEmailByUsername = async (username) => {
    try {
        const response = await fetch(`${API_PROFILE_URL}/profiles/by-username?username=${username}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user profile');
        }

        const profile = await response.json(); // Asumiendo que el API devuelve el perfil completo
        return profile.email; // Devuelve el email del perfil
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// NUEVO: Handler para obtener el estado de los usuarios
export const getUsersStatus = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/get-users-status`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch users status');
        }

        const usersStatus = await response.json(); // Asumiendo que el API devuelve la lista de estados de usuarios
        return { success: true, users: usersStatus }; // Devuelve el estado de los usuarios
    } catch (error) {
        return { success: false, message: error.message };
    }
};


export const getStatusByEmail = async (email, statusData) => {
    try {
        const userStatus = statusData.find(user => user.email === email);
        if (userStatus) {
            return { success: true, status: userStatus.is_blocked }; // Devuelve el estado del usuario (bloqueado o no)
        } else {
            throw new Error('El estado del usuario no se encontró'); // Maneja el caso en que no se encuentra el estado
        }
    } catch (error) {
        console.error('Error al obtener el estado por email:', error);
        return { success: false, message: error.message }; // Manejo de errores
    }
};