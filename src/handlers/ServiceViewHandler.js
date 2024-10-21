// src/ServiceViewHandler.js
const BASE_URL = 'https://metrics-microservice-hg4i.onrender.com'; 

export const fetchServices = async () => {
  const token = localStorage.getItem('token');

  console.log('Token:', token);

  if (!token) {
    console.error('Token not found');
    return [];
  }
  
  try {
    const response = await fetch(`${BASE_URL}/services/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los servicios');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return []; 
  }
};

export const fetchServiceStatus = async (serviceName) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found');
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/services/${serviceName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener el estado del servicio');
    }
    const data = await response.json();
    return {
      status: data.status, 
      createdAt: data.createdAt,
      description: data.description,
      timeRunning: data.timeRunning,
      url: data.url,
      cpuUsage: data.cpu_usage,
      memoryUsage: data.memory_usage,
    };
  } catch (error) {
    console.error('Error fetching service status:', error);
    return null;
  }
};

// Función para traducir el estado del servicio
export const getServiceStatus = (status) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'suspended':
      return 'Suspendido';
    default:
      return 'Estado desconocido';
  }
};

// Función para traducir la fecha de creación en formato MM/DD/YYYY
export const getServiceCreationDate = (createdAt) => {
  const date = new Date(createdAt);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11, por eso sumamos 1
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Función para traducir la descripción del servicio
export const getServiceDescription = (serviceName) => {
  switch (serviceName) {
    case 'metrics-microservice':
      return 'Provee métricas de los servicios';
    case 'post-microservice':
      return 'Permite publicar y obtener posts';
    case 'profile-microservice':
      return 'Maneja la información de los usuarios';
    case 'auth-microservice':
      return 'Maneja la autenticación de los usuarios';
    default:
      return 'Descripción no encontrada';
  }
};
