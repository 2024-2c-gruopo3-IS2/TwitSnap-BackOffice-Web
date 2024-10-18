// TwitSnapHandlers.js

import { getToken } from './AuthHandler'; // Asegúrate de que la ruta sea correcta
const API_URL = 'https://post-microservice.onrender.com'; // Cambia esto a tu URL real

export const fetchAllSnaps = async () => {
  const token = getToken(); // Obtiene el token de autenticación

  if (!token) {
    console.error('Token de autenticación no encontrado.');
    return { success: false, message: 'Token de autenticación no encontrado.' };
  }

  try {
    console.log('Fetching snaps...');

    const response = await fetch(`${API_URL}/snaps/all-snaps`, { // Asegúrate de que la ruta sea correcta
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token, // Incluye el token en los encabezados
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Print data in json format
    console.log(JSON.stringify(data, null, 2));

    return { success: true, snaps: data.data }; // Devuelve la lista de snaps
  } catch (error) {
    console.error('Error fetching snaps:', error);
    return { success: false, message: 'Error al conectar con el servidor.' }; // Maneja el error
  }
};
