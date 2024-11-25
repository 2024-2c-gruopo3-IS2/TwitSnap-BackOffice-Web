import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/ServiceModal.css'; 

// Registro de componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ServiceModal = ({ service, onClose }) => {
  // Configuración de datos del gráfico de CPU
  const cpuData = {
    labels: ['0 min', '10 min', '20 min', '30 min', '40 min', '50 min', '60 min'],
    datasets: [
      {
        label: 'Uso de CPU (%)',
        data: service.cpuUsage,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Configuración de datos del gráfico de Memoria
  const memoryData = {
    labels: ['0 min', '10 min', '20 min', '30 min', '40 min', '50 min', '60 min'],
    datasets: [
      {
        label: 'Uso de Memoria (MB)',
        data: service.memoryUsage,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div className="service-modal-overlay">
      <div className="service-modal-content">
        <button className="service-modal-close" onClick={onClose}>
          <img
            src="https://cdn0.iconfinder.com/data/icons/round-ui-icons/512/close_red.png"
            alt="Cerrar"
            className="service-close-icon"
          />
        </button>

        <h2>Detalles del Servicio</h2>

        {/* URL clickeable */}
        <p><strong>URL del Servicio:</strong> <a href={service.url} target="_blank" rel="noopener noreferrer">{service.url}</a></p>

        {/* Tiempo corriendo */}
        <p><strong>Tiempo de Ejecución:</strong> {service.timeRunning}</p>

        {/* Gráficos de uso */}
        <div className="service-chart-container">
          <div className="service-chart-item">
            <h3>Uso de CPU</h3>
            <Line data={cpuData} />
          </div>

          <div className="service-chart-item">
            <h3>Uso de Memoria</h3>
            <Line data={memoryData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
