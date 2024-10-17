import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../handlers/SignUpHandler'; // Importa la función signup
import '../styles/Signup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setErrors({ email: '', password: '' });
    
    let hasError = false;
    let newErrors = { email: '', password: '' };

    // Validar correo electrónico
    if (!email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'El correo electrónico no es válido.';
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await signUp(email, password); // Llama a la función de signup
    
      if (response.success) {
        router.push({
          pathname: './Home', // Redirige a la página de inicio
          params: { email, password }
        });
      } else {
        if (response.message === 'Email already in use') {
          alert('Error', 'El correo electrónico ya está en uso.');
        } else {
          alert('Error', 'Error al registrar el usuario.');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error', 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Regístrate en TwitSnap Backoffice</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Correo electrónico"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label htmlFor="password">Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Contraseña"
              className={`input-field password-input ${errors.password ? 'input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-visibility-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}
          
          {errors.server && <p className="error-message">{errors.server}</p>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Regístrate'}
          </button>
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
