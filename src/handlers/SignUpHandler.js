import { saveToken } from './AuthHandler';

export async function signUp(email, password) {
  const API_URL = 'https://auth-microservice-vvr6.onrender.com/auth/signup';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, is_admin: true }),
    });

    const data = await response.json();

    console.log('Data:', data);

    if (response.ok) {
      if (data.token) {
        await saveToken(data.token);
        return { success: true, token: data.token };
      } else {
        return { success: false, message: data.message || 'Error al registrar el usuario' };
      }
    } 
    return { success: false, message: data.message || 'Error al registrar el usuario' };
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return { success: false, message: 'Error al conectar con el servidor.' };
  }
}
