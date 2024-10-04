import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia la importación
import App from './App'; // Asegúrate de que la ruta sea correcta
import './styles/index.css'; // Si tienes un CSS global

const root = ReactDOM.createRoot(document.getElementById('root')); // Crea el root
root.render(<App />); // Renderiza la aplicación
