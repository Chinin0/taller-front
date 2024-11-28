import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateClient from './components/cliente/CreateClient';
import './components/css/App.css';
import Dashboard from './components/Dashboard';
import ListClients from './components/cliente/ListClients';
import ClientDetails from './components/detalle_cliente/ClientDetails';
import ClientDetailsCreate from './components/detalle_cliente/ClientDetailsCreate';
import EditClient from './components/cliente/EditClient';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ListPrendas from './components/prendas/ListPrendas';
import CreatePrenda from './components/prendas/CreatePrenda';
import PrendaDetails from './components/prendas/PrendaDetails';
import PrendaEdit from './components/prendas/PrendaEdit';
import CreateSolicitudCredito from './components/creditos/SolicitudCredito';
import { CrearCredito, ListaCreditos } from './components/creditos/ListaCreditos';

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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dasboard" element={<Dashboard />} />

        <Route path="/list-client" element={<ListClients message={message} />} />
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/clientes/:id" element={<ClientDetails />} />

        <Route path="/detalle-cliente/create" element={<ClientDetailsCreate />} />
        <Route path="/clientes/editar/:id" element={<EditClient />} />

        <Route path="/prendas" element={<ListPrendas />} />
        <Route path="/prendas/create" element={<CreatePrenda />} />
        <Route path="/prendas/:id" element={<PrendaDetails />} />
        <Route path="/prendas/editar/:id" element={<PrendaEdit />} />

        <Route path="/creditos" element={<ListaCreditos />} />
        <Route path="/creditos/create" element={<CrearCredito />} />

        <Route path="/solicitud/" element={<CreateSolicitudCredito />} />

      </Routes>
    </Router>
  );
}
export default App;