const BASE_URL = 'https://metrics-microservice-hg4i.onrender.com'; 

export const getMetrics = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token not found');
        return null;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/metrics`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
        });
        if (!response.ok) {
        throw new Error('Error al obtener las métricas');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return null; 
    }
    }