// handlers/LoginHandler.js

const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/signin';

/**
 * Función para iniciar sesión
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} - Respuesta con el token o mensaje de error.
 */
export const login = async (email, password) => {
  const api_url = 'https://auth-microservice-vvr6.onrender.com/auth/signin'
  try {
    const response = await fetch(api_url, {
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
 * Función para solicitar restablecimiento de contraseña
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<Object>} - Respuesta con éxito o mensaje de error.
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: 'Enlace de recuperación enviado a tu correo.' };
    }

    return { success: false, message: data.message || 'No se pudo procesar la solicitud.' };
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    return { success: false, message: 'Error al conectar con el servidor.' };
  }
};

/**
 * Función para restablecer contraseña
 * @param {string} token - El token para restablecer la contraseña.
 * @param {string} newPassword - La nueva contraseña.
 * @returns {Promise<Object>} - Respuesta con éxito o mensaje de error.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true, message: 'Contraseña restablecida exitosamente.' };
    }

    return { success: false, message: data.message || 'No se pudo restablecer la contraseña.' };
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return { success: false, message: 'Error al conectar con el servidor.' };
  }
};
