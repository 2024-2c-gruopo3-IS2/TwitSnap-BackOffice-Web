// src/ServiceView.js
import React, { useState } from 'react';
import '../styles/ServiceView.css'; // Asegúrate de tener este archivo de estilos

const ServiceView = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Service 1', status: 'Active', createdAt: '2023-05-01', description: 'Main API Service' },
    { id: 2, name: 'Service 2', status: 'Inactive', createdAt: '2023-06-15', description: 'Notification Service' }
  ]);

  return (
    <section className="section">
      <h2>Service List</h2>
      <table>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Description</th>
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
