import React, { useState, useEffect } from 'react';
import { fetchServices, fetchServiceStatus } from '../handlers/ServiceViewHandler';
import '../styles/ServiceView.css';
import ServiceModal from './ServiceModal';
import moreDetailsImage from '../assets/images/moreDetails.png'; 

const ServiceView = () => {
  const [servicesInfo, setServicesInfo] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar el loading

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const getServiceDescription = (serviceName) => {
    switch (serviceName) {
      case 'metrics-microservice':
        return 'Provee métricas de los servicios';
      case 'post-microservice':
        return 'Permite publicar y obtener posts';
      case 'profile-microservice':
        return 'Maneja la información de los usuarios';
      case 'auth-microservice':
        return 'Maneja la autenticación de los usuarios';
      default:
        return 'Descripción no encontrada';
    }
  };

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true); // Inicia el loading
      const fetchedServices = await fetchServices();

      const serviceInfo = await Promise.all(
        fetchedServices.map(async (service) => {
          const statusData = await fetchServiceStatus(service);
          return { 
            name: service,
            status: statusData.status,
            createdAt: statusData.createdAt,
            description: statusData.description,
            timeRunning: statusData.timeRunning,
            url: statusData.url,
            cpuUsage: statusData.cpuUsage,
            memoryUsage: statusData.memoryUsage,
          };
        })
      );

      setServicesInfo(serviceInfo);
      setLoading(false); // Finaliza el loading
    };

    loadServices();
  }, []);

  return (
    <section className="section">
      <h2>Servicios</h2>

      {loading ? (
        <div className="loading-container">
          <div className="loading-circle"></div> {/* Círculo de carga */}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Creado en</th>
              <th>Descripción</th>
              <th>Detalles</th>            
            </tr>
          </thead>
          <tbody>
            {servicesInfo.map((service, index) => (
              <tr key={index}>
                <td>{service.name}</td>
                <td>{service.status}</td>
                <td>{service.createdAt}</td>
                <td>{getServiceDescription(service.name)}</td>
                <td className="details-col">
                      <button onClick={() => handleOpenModal(service)}>
                        <img src={moreDetailsImage} alt="Detalles" />
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && selectedService && (
        <ServiceModal service={selectedService} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default ServiceView;
