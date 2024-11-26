import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout';
import CreateClient from './components/cliente/CreateClient';
import './components/css/App.css';
import Dashboard from './components/Dashboard';
import ListClients from './components/cliente/ListClients';
import ClientDetails from './components/detalle_cliente/ClientDetails';
import ClientDetailsCreate from './components/detalle_cliente/ClientDetailsCreate';
import EditClient from './components/cliente/EditClient';

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
      <SidebarLayout>
        <Routes>
          <Route path="/dasboard" element={<Dashboard />} />
          <Route path="/list-client" element={<ListClients message={message} />} />
          <Route path="/create-client" element={<CreateClient />} />
          <Route path="/clientes/:id" element={<ClientDetails />} />
          <Route path="/detalle-cliente/create" element={<ClientDetailsCreate />} />
          <Route path="/clientes/editar/:id" element={<EditClient />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}
export default App;