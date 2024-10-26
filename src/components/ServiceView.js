import React, { useState, useEffect } from 'react';
import {
  fetchServices,
  fetchServiceStatus,
  getServiceDescription,
  getServiceStatus,
  getServiceCreationDate,
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

  // Estados para los filtros
  const [filterType, setFilterType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const fetchedServices = await fetchServices();

      const serviceInfo = await Promise.all(
        fetchedServices.map(async (service) => {
          const statusData = await fetchServiceStatus(service);
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

      // Ordenar los servicios por nombre en orden alfabético
      const sortedServices = serviceInfo.sort((a, b) => a.name.localeCompare(b.name));
      setServicesInfo(sortedServices);
      setFilteredServices(sortedServices);
      setLoading(false);
    };

    loadServices();
  }, []);

  // Filtro por término de búsqueda o fechas
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

    // Ordenar los servicios filtrados por nombre en orden alfabético
    const sortedFiltered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredServices(sortedFiltered);
  }, [searchTerm, filterType, startDate, endDate, servicesInfo]);

  // Funciones para manejar los filtros
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (type) => {
    setFilterType(type);
    setSearchTerm(''); // Resetear el término de búsqueda al cambiar el filtro
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

          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Creado en</th>
                <th>Estado</th>
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
                  <td className="details-col">
                    <button onClick={() => handleOpenModal(service)}>
                      <img src={moreDetailsImage} alt="Detalles" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && selectedService && (
            <ServiceModal service={selectedService} onClose={handleCloseModal} />
          )}
        </>
      )}
    </section>
  );
};

export default ServiceView;
