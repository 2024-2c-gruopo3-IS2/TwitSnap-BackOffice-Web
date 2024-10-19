// src/ServiceViewHandler.js
const BASE_URL = 'http://localhost:8000'; 

export const fetchServices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/services/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Añade aquí cualquier otro header que necesites, como el token de autenticación
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los servicios');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return []; // Devuelve un array vacío en caso de error
  }
};

export const fetchServiceStatus = async (serviceName) => {
  try {
    const response = await fetch(`${BASE_URL}/services/${serviceName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Añade aquí cualquier otro header que necesites, como el token de autenticación
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener el estado del servicio');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service status:', error);
    return null; // Devuelve null en caso de error
  }
};
