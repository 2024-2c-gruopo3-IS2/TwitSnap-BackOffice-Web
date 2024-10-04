// src/Home.js
import React from 'react';
import '../styles/Home.css';  // Puedes añadir estilos personalizados

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to My Website</h1>
        <p>This is the home page of my awesome React project!</p>
      </header>
      <section className="home-content">
        <p>Here you can explore various sections of the site.</p>
        <a href="/about" className="home-link">Learn more about us</a>
      </section>
    </div>
  );
};

export default Home;
