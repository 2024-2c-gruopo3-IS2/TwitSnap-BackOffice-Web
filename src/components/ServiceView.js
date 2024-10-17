// src/ServiceView.js
import React, { useState } from 'react';
import '../styles/ServiceView.css'; // Asegúrate de tener este archivo de estilos

const ServiceView = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Servicio 1', status: 'Activo', createdAt: '2023-05-01', description: 'Servicio de Autenticación' },
    { id: 2, name: 'Servicio 2', status: 'Inactivo', createdAt: '2023-06-15', description: 'Servicio de Posteo' }
  ]);

  return (
    <section className="section">
      <h2>Service List</h2>
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
          {services.map(service => (
            <tr key={service.id}>
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
