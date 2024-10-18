// handlers/profileHandler.js

import { getToken } from './AuthHandler';

const API_URL = 'https://profile-microservice.onrender.com';


export const getEmailByUsername = async (username) => {
    try {
        const response = await fetch(`${API_URL}/profiles/by-username?username=${username}`, { 
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

/**
 * Obtiene la lista de todos los nombres de usuario.
 * @returns {Promise<Object>} Una lista de usuarios.
 */
export async function getAllUsers() {
    const token = await getToken();
    if (!token) {
        console.error('Token de autenticación no encontrado.');
        return { success: false, message: 'Token de autenticación no encontrado.' };
    }
    const users_url = `${API_URL}/profiles/all-usernames/`;

    try {
        const response = await fetch(users_url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Usuarios encontrados:', data);
            return { success: true, data: data };
        } else {
            console.log('Error al obtener usuarios:', data);
            return { success: false, message: data.detail || 'Error al obtener usuarios.' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al conectar con el servidor.' };
    }
}
