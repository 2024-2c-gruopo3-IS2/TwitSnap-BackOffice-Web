import React, { useState, useEffect } from 'react';
import '../styles/TwitSnapsView.css'; // Importa un archivo de estilos para mejorar la presentación

// Simulamos datos de TwitSnaps. En un caso real, estos datos vendrían de una API.
const mockTwitSnaps = [
  { id: 1, title: 'TwitSnap 1', content: 'Contenido del TwitSnap 1', author: 'Usuario1', createdAt: '2023-05-01' },
  { id: 2, title: 'TwitSnap 2', content: 'Contenido del TwitSnap 2', author: 'Usuario2', createdAt: '2023-06-15' },
  { id: 3, title: 'TwitSnap 3', content: 'Contenido del TwitSnap 3', author: 'Usuario3', createdAt: '2023-07-20' },
  { id: 4, title: 'TwitSnap 4', content: 'Contenido del TwitSnap 4', author: 'Usuario4', createdAt: '2023-08-10' },
  { id: 5, title: 'TwitSnap 5', content: 'Contenido del TwitSnap 5', author: 'Usuario5', createdAt: '2023-09-05' },
];

const TwitSnapsView = () => {
  const [twitSnaps, setTwitSnaps] = useState([]);

  useEffect(() => {
    // Aquí podrías reemplazar esto con una llamada a una API real.
    setTwitSnaps(mockTwitSnaps);
  }, []);

  return (
    <section className="section twitsnap-view">
      <h2>Lista de TwitSnaps</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Fecha de Creación</th>
            <th>Contenido</th>
          </tr>
        </thead>
        <tbody>
          {twitSnaps.map(twitSnap => (
            <tr key={twitSnap.id}>
              <td>{twitSnap.title}</td>
              <td>{twitSnap.author}</td>
              <td>{twitSnap.createdAt}</td>
              <td>{twitSnap.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TwitSnapsView;
