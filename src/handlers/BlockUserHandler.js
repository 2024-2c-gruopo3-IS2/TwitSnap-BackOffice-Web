// src/BlockUserHandler.js

const API_BASE_URL = 'https://auth-microservice-vvr6.onrender.com'; // Asegúrate de que esta URL sea la correcta para tu API

export const blockUser = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to block user');
        }

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const unblockUser = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/unblock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to unblock user');
        }

        return await response.json();
    } catch (error) {
        return { success: false, message: error.message };
    }
};
