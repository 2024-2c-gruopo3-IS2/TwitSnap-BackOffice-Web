// src/components/Login.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../handlers/LoginHandler'; // Importa la función login
import '../styles/Login.css';
import logo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setError(null); // Reinicia el error

    try {
      const data = await login(email, password); // Llama a la función de login
      // Aquí puedes manejar el token (data.token) según lo necesites
      console.log('Token:', data.token);
    } catch (err) {
      setError(err.message); // Establece el mensaje de error
    }
  };

  return (
    <div className="login-container">
      <img src={logo} className="background-image" alt="Custom Logo" />
      <div className="login-box">
        <h2>TwitSnap Backoffice</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Email o nombre de usuario</label>
          <input 
            type="text" 
            id="username" 
            placeholder="Email o nombre de usuario" 
            className="input-field"
            value={email} // Controla el input
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
          />
          <label htmlFor="password">Contraseña</label>
          <div className="password-container">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              placeholder="Contraseña" 
              className="input-field password-input" 
              value={password} // Controla el input
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
            />
            <button 
              type="button" 
              className="password-visibility-button" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>} {/* Muestra el mensaje de error */}
          <button type="submit">Iniciar sesión</button>
        </form>
        <hr className="separator" />
        <div className="extra-links">
          <Link to="/">¿Olvidaste tu contraseña?</Link>
        </div>
        <div className="extra-links">
          <span className="no-account-text">¿No tienes una cuenta?</span>
          <Link to="/signup">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
