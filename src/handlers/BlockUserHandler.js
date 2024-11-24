// src/BlockUserHandler.js

import { getToken } from './AuthHandler';

const API_BASE_URL = 'https://auth-microservice-vvr6.onrender.com'; // Asegúrate de que esta URL sea la correcta para tu API

export const blockUser = async (email, reason, days) => {
    try {
        console.log('Blocking user:', email, 'Reason:', reason, 'Days:', days);
        
        const response = await fetch(`${API_BASE_URL}/auth/block-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email, 
                reason, 
                days 
            }),
        });

        // Parseamos la respuesta una sola vez
        const responseData = await response.json();

        if (!response.ok || responseData.message !== 'user successfully blocked') {
            throw new Error(responseData.error || 'Failed to block user');
        }

        return { success: true, message: responseData.message };
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

export const getBlockedUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/get-blocked-users`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blocked users');
        }

        const responseData = await response.json();
        return { success: true, data: responseData.users };
    } catch (error) {
        return { success: false, message: error.message };
    }
}