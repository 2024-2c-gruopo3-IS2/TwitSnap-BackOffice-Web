const BASE_URL = 'https://metrics-microservice-hg4i.onrender.com'; 

export const getMetrics = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token not found');
        return null;
    }

    console.log('token:', token);
    
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


export const postBlockUserMetric = async (email, reason, duration) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token not found');
        return null;
    }

    const dataString = `${email},${reason},${duration}`;

    try {
        const response = await fetch(`${BASE_URL}/metrics/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
        },
        body: JSON.stringify({ value: dataString }),
        });
        if (!response.ok) {
        throw new Error('Error al bloquear usuario');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error blocking user:', error);
        return null; 
    }
}