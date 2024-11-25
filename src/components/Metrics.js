import React, { useState, useEffect } from 'react';
import '../styles/Metrics.css'; // Asegúrate de crear el archivo CSS para el estilo
import { getMetrics } from '../handlers/MetricsHandler'; // Importa el handler de métricas

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula una carga inicial de datos
    const fetchMetrics = async () => {
        setLoading(true);   
        const fetchedMetrics = await getMetrics(); 
        
        console.log("[METRICS]", fetchedMetrics); // Imprime las métricas obtenidas

        // Mapear las métricas de bloqueo
        fetchedMetrics.blocks = fetchedMetrics.blocks.map((block) => {
            const [email, reason, duration] = block.split(',');
            return { email, reason, duration };
        },[]);

        // Mapear las métricas de zonas geográficas
        fetchedMetrics.geographic_zones = fetchedMetrics.geographic_zones.map((zoneData) => {
            const [zone, users] = zoneData.split(',');
            return { zone, users };
        })
        
        setMetrics(fetchedMetrics);
        setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-circle"></div>
      </div>
    );
  }

  return (
    <section className="metrics-section">
      <h2>Métricas de la Plataforma</h2>

      {/* Métricas de Nuevos Usuarios */}
      <div className="metrics-block">
        <h3>Nuevos Usuarios</h3>
        <table>
          <thead>
            <tr>
              <th>Cantidad de Usuarios Registrados</th>
              <th>Tiempo Promedio</th>
              <th>Tasa de Éxito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{metrics.signups.length}</td>
              <td>{(metrics.signups.reduce((acc, val) => acc + val, 0) / metrics.signups.length).toFixed(2)}</td>
              <td>{((metrics.signups.length / (metrics.signups.length + metrics.signups_failed))*100).toFixed(0)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Métricas de Login */}
      <div className="metrics-block">
        <h3>Inicios de Sesión con mail y contraseña</h3>
        <table>
          <thead>
            <tr>
              <th>Cantidad de Inicios Exitosos</th>
              <th>Tiempo Promedio</th>
              <th>Tasa de Éxito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>{metrics.logins.length}</td>
                <td>{(metrics.logins.reduce((acc, val) => acc + val, 0) / metrics.logins.length).toFixed(2)}</td>
                <td>{((metrics.logins.length / (metrics.logins.length + metrics.logins_failed)) * 100).toFixed(0)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

        {/* Métricas de Login con Google*/}
            <div className="metrics-block">
        <h3>Inicios de Sesión con cuenta de Google</h3>
        <table>
          <thead>
            <tr>
              <th>Cantidad de Inicios Exitosos</th>
              <th>Tiempo Promedio</th>
              <th>Tasa de Éxito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>{metrics.logins_google.length}</td>
                <td>{(metrics.logins_google.reduce((acc, val) => acc + val, 0) / metrics.logins_google.length).toFixed(2)}</td>
                <td>{((metrics.logins_google.length / (metrics.logins.length + metrics.logins_google_failed)) * 100).toFixed(0)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Usuarios Bloqueados */}
      <div className="metrics-block">
        <h3>Usuarios Bloqueados</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Razón</th>
              <th>Duración (días)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.blocks.map((block, index) => (
              <tr key={index}>
                <td>{block.email}</td>
                <td>{block.reason}</td>
                <td>{block.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recupero de Contraseña */}
      <div className="metrics-block">
        <h3>Recupero de Contraseña</h3>
        <table>
          <thead>
            <tr>
              <th>Cantidad de Recuperaciones Exitosas</th>
              <th>Tiempo Promedio</th>
              <th>Tasa de Éxito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>{metrics.password_recovers.length}</td>
                <td>{(metrics.password_recovers.reduce((acc, val) => acc + val, 0) / metrics.password_recovers.length).toFixed(2)}</td>
                <td>{((metrics.password_recovers.length / (metrics.password_recovers.length + metrics.password_recover_failed)) * 100).toFixed(0)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Zonas Geográficas */}
      <div className="metrics-block">
        <h3>Usuarios por Zona Geográfica</h3>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Usuarios</th>
            </tr>
          </thead>
          <tbody>
            {metrics.geographic_zones.map((zone, index) => (
              <tr key={index}>
                <td>{zone.zone}</td>
                <td>{zone.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Metrics;
