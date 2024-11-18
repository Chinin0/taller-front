import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home';
import CreateClient from './components/CreateClient';
import './components/css/App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/hello/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Gestión de Clientes</h1>
          <p className="api-message">{message}</p>
        </header>

        <nav className="app-nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/create-client" className="nav-link">Crear Cliente</Link>
        </nav>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home message={message} />} />
            <Route path="/create-client" element={<CreateClient />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
