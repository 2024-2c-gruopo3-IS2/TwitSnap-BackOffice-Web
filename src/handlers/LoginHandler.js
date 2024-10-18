// handlers/LoginHandler.js

const API_URL = 'https://auth-microservice-vvr6.onrender.com';

/**
 * Función para iniciar sesión
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} - Respuesta con el token o mensaje de error.
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, is_admin: true }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Error al iniciar sesión.');
    }

    const data = await response.json();
    if (data.token) {
      console.log('Inicio de sesión exitoso, token recibido:', data.token);
      return { success: true, token: data.token };
    }

    return { success: false, message: data.message || 'Error desconocido al iniciar sesión.' };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, message: error.message || 'Error al conectar con el servidor.' };
  }
};

/**
 * Función para obtener el correo electrónico desde el token
 * @param {string} token - El token de autenticación.
 * @returns {Promise<string>} - El correo electrónico del usuario o un mensaje de error.
 */
export const getEmailFromToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/get-email-from-token`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'token': token }), // Enviar el token en el cuerpo
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Error al obtener el correo electrónico del token.');
    }

    const data = await response.json();
    return data.email; // Retorna el correo electrónico
  } catch (error) {
    console.error('Error en getEmailFromToken:', error);
    throw new Error(error.message || 'Error al conectar con el servidor.');
  }
};

