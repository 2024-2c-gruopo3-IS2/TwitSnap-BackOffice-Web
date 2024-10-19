import { cpuUsage } from "process";

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
