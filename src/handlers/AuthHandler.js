// src/handlers/authTokenHandler.js

import { SignJWT, jwtVerify } from 'jose';

const TOKEN_KEY = 'token';
const SECRET_KEY = new TextEncoder().encode('tu_clave_secreta'); // Cambia esto por una clave secreta más segura

/**
 * Crea un token JWS con los datos del usuario.
 * @param {Object} userData - Datos del usuario a incluir en el token.
 * @param {string} expiresIn - Tiempo de expiración del token en segundos.
 * @returns {string} - Token JWS firmado.
 */
export const createToken = async (userData, expiresIn = 3600) => { // Por defecto 1 hora
  try {
    const token = await new SignJWT({ ...userData })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Date.now() + expiresIn * 1000)
      .sign(SECRET_KEY);
    
    saveToken(token);
    console.log('Token creado y guardado exitosamente.');
    return token;
  } catch (error) {
    console.error('Error al crear el token:', error);
    throw new Error('No se pudo crear el token de autenticación.');
  }
};

/**
 * Guarda el token de autenticación en el almacenamiento local.
 * @param {string} token - El token de autenticación.
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token guardado exitosamente.');
  } catch (error) {
    console.error('Error al guardar el token:', error);
    throw new Error('No se pudo guardar el token de autenticación.');
  }
};

/**
 * Obtiene el token de autenticación del almacenamiento local.
 * @returns {string | null} - El token de autenticación o null si no existe.
 */
export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Token:', token);
    if (token) {
      return token;
    } else {
      console.log('No se encontró el token de autenticación.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

/**
 * Elimina el token de autenticación del almacenamiento local.
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log('Token eliminado exitosamente.');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
    throw new Error('No se pudo eliminar el token de autenticación.');
  }
};

/**
 * Verifica el token JWS.
 * @param {string} token - El token a verificar.
 * @returns {Object | null} - Los datos decodificados del token o null si es inválido.
 */
export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log('Token verificado exitosamente:', payload);
    return payload;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return null;
  }
};
