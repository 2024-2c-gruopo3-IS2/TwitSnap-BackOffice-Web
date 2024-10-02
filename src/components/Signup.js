import React, { useState } from 'react'; // Importa useState
import { Link } from 'react-router-dom'; // Importa Link para navegación
import '../styles/Signup.css';
import logo from '../assets/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Asegúrate de tener react-icons instalados

function SignUp() {
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword); // Cambia el estado
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2> Regístrate en TwitSnap Backoffice!</h2>
        <form className="login-form">
          <label htmlFor="username">Email o nombre de usuario</label>
          <input 
            type="text" 
            id="username" 
            placeholder="Email o nombre de usuario" 
            className="input-field"
          />
          <label htmlFor="password">Contraseña</label>
          <div className="password-container">
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password" 
              placeholder="Contraseña" 
              className="input-field password-input" 
            />
            <button 
              type="button" 
              className="password-visibility-button" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>
          <button type="submit">Iniciar sesión</button>
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
