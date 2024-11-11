import React, { useState, useEffect } from 'react';
import {
  fetchServices,
  fetchService,
  getServiceDescription,
  getServiceStatus,
  getServiceCreationDate,
  suspendService,
  resumeService,
} from '../handlers/ServiceViewHandler';
import '../styles/ServiceView.css';
import ServiceModal from './ServiceModal';
import moreDetailsImage from '../assets/images/moreDetails.png';

// Componente para el indicador de estado
const StatusIndicator = ({ status }) => {
  const isActive = status === 'Activo';
  const indicatorStyle = {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isActive ? '#4CAF50' : '#F44336',
    marginRight: '5px',
  };

  return <span style={indicatorStyle}></span>;
};

const ServiceView = () => {
  const [servicesInfo, setServicesInfo] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingService, setLoadingService] = useState(null); // Estado para controlar la carga de un servicio específico

  const [filterType, setFilterType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const protectedServices = ['auth-microservice', 'metrics-microservice'];

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const toggleServiceStatus = (serviceName) => {
    const service = servicesInfo.find((service) => service.name === serviceName);
    const action = service.status === 'Activo' ? suspendService : resumeService;

    setLoadingService(serviceName); // Inicia la carga para el servicio específico

    action(serviceName)
      .then((success) => {
        if (success) {
          const updatedServices = servicesInfo.map((service) => {
            if (service.name === serviceName) {
              service.status = service.status === 'Activo' ? 'Suspendido' : 'Activo';
            }
            return service;
          });

          setServicesInfo(updatedServices);
        }
      })
      .catch((error) => {
        console.error('Error toggling service status:', error);
      })
      .finally(() => {
        setLoadingService(null); // Finaliza la carga
      });
  };

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const fetchedServices = await fetchServices();

      const serviceInfo = await Promise.all(
        fetchedServices.map(async (service) => {
          const statusData = await fetchService(service);
          return {
            name: service,
            status: getServiceStatus(statusData.status),
            createdAt: getServiceCreationDate(statusData.createdAt),
            description: getServiceDescription(service),
            timeRunning: statusData.timeRunning,
            url: statusData.url,
            cpuUsage: statusData.cpuUsage,
            memoryUsage: statusData.memoryUsage,
          };
        })
      );

      const sortedServices = serviceInfo.sort((a, b) => a.name.localeCompare(b.name));
      setServicesInfo(sortedServices);
      setFilteredServices(sortedServices);
      setLoading(false);
    };

    loadServices();
  }, []);

  useEffect(() => {
    const filtered = servicesInfo.filter((service) => {
      const value = filterType === 'status' ? service.status : service[filterType]?.toString().toLowerCase() || '';

      if (filterType === 'createdAt' && startDate && endDate) {
        const serviceDate = new Date(service.createdAt).setHours(0, 0, 0, 0);
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);

        return serviceDate >= start && serviceDate <= end;
      }

      if (filterType === 'status') {
        return value === searchTerm;
      }

      return value.includes(searchTerm.toLowerCase());
    });

    const sortedFiltered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredServices(sortedFiltered);
  }, [searchTerm, filterType, startDate, endDate, servicesInfo]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (type) => {
    setFilterType(type);
    setSearchTerm('');
  };
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  return (
    <section className="section">
      <h2>Servicios</h2>

      {loading ? (
        <div className="loading-container">
          <div className="loading-circle"></div>
        </div>
      ) : (
        <>
          <div className="search-bar">
            {filterType === 'createdAt' ? (
              <div className="date-range-filter">
                <label>
                  Desde:
                  <input type="date" value={startDate} onChange={handleStartDateChange} />
                </label>
                <label>
                  Hasta:
                  <input type="date" value={endDate} onChange={handleEndDateChange} />
                </label>
              </div>
            ) : (
              <>
                <span className="search-icon">
                  <img
                    src="https://www.citypng.com/public/uploads/preview/magnifying-glass-search-white-icon-transparent-png-701751694974238f0vl5bmpat.png"
                    alt="Lupa"
                    className="search-icon-img"
                  />
                </span>
                {filterType === 'status' ? (
                  <div className="select-container">
                    <select className="styled-select" value={searchTerm} onChange={handleSearchChange}>
                      <option value="" disabled hidden>Selecciona un estado</option>
                      <option value="Activo">Activo</option>
                      <option value="Suspendido">Suspendido</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar..."
                  />
                )}
              </>
            )}
          </div>

          <div className="filter-buttons">
            <button className={filterType === 'name' ? 'active' : ''} onClick={() => handleFilterChange('name')}>
              Nombre
            </button>
            <button className={filterType === 'status' ? 'active' : ''} onClick={() => handleFilterChange('status')}>
              Estado
            </button>
            <button className={filterType === 'createdAt' ? 'active' : ''} onClick={() => handleFilterChange('createdAt')}>
              Fecha
            </button>
          </div>

          <table className="table-custom">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Creado en</th>
                <th>Estado</th>
                <th>Acción</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.createdAt}</td>
                  <td>
                    <StatusIndicator status={service.status} />
                    {service.status}
                  </td>
                  <td>
                    {protectedServices.includes(service.name) ? (
                      <span>Servicio protegido</span>
                    ) : (
                      <button
                        className={service.status === 'Activo' ? 'button-suspended' : 'button-active'}
                        onClick={() => toggleServiceStatus(service.name)}
                        disabled={loadingService === service.name} // Deshabilitar el botón mientras se procesa la acción
                      >
                        {loadingService === service.name ? 'Procesando...' : (service.status === 'Activo' ? 'Desactivar' : 'Activar')}
                      </button>
                    )}
                  </td>
                  <td className="details-col">
                    <button className="details-button" onClick={() => handleOpenModal(service)}>
                      <img src={moreDetailsImage} alt="Detalles" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {isModalOpen && (
        <ServiceModal service={selectedService} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default ServiceView;
