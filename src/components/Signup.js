// src/components/SignUp.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../handlers/SignUpHandler'; // Importa la función signup
import '../styles/Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUp() {
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
      const data = await signUp(email, password); // Llama a la función de signup
      // Aquí puedes manejar el token (data.token) según lo necesites
      console.log('Token:', data.token);
    } catch (err) {
      setError(err.message); // Establece el mensaje de error
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2> ¡Regístrate en TwitSnap Backoffice!</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Email</label>
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
          <button type="submit">Regístrate</button>
        </form>
        <hr className="separator" />
        <div className="extra-links">
          <span className="no-account-text">¿Ya tienes una cuenta?</span>
          <Link to="/login">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
