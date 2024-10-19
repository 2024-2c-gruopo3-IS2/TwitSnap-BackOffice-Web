// src/ServiceView.js
import React, { useState, useEffect } from 'react';
import { fetchServices } from '../handlers/ServiceViewHandler'; // Asegúrate de importar las funciones
import '../styles/ServiceView.css';

const ServiceView = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
    };
    loadServices();
  }, []);

  return (
    <section className="section">
      <h2>Servicios</h2>
      <table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Creado en</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.name}</td>
              <td>{service.status}</td>
              <td>{service.createdAt}</td>
              <td>{service.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ServiceView;
