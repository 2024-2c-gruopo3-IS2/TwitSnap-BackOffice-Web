import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import TwitSnapsView from './components/TwitSnapsView';
import { getToken } from './handlers/AuthHandler'; 
import Spinner from 'react-bootstrap/Spinner'; 
import VerificationView from './components/VerificationView';
import Metrics from './components/Metrics';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();

        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000' }}>
        <Spinner animation="border" role="status" style={{ color: '#1DA1F2' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Si está autenticado, redirigir a home, de lo contrario mostrar login */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/twitsnaps" element={<TwitSnapsView />} />
        <Route path="/verification" element={<VerificationView/>} />
        <Route path="/metrics" element={<Metrics />} />
        {/* Si no está autenticado, redirigir al login */}
        {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
