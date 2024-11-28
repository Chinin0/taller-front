import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirección
import SidebarLayout from '../SidebarLayout';

function CreateClient() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar el envío
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true); // Activamos el estado de carga

    if (!nombre || !apellidos || !fechaNacimiento || !telefono || !genero) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Obtén el token de localStorage
      await axios.post(
        'http://localhost:8000/api/clientes/create',
        {
          nombre,
          apellidos,
          fecha_nacimiento: fechaNacimiento,
          telefono,
          genero,
        },
        {
          headers: {
            Authorization: `Token ${token}`, // Incluye el token en los encabezados
          },
        }
      );
      setSuccessMessage("Cliente creado exitosamente.");
      setNombre('');
      setApellidos('');
      setFechaNacimiento('');
      setTelefono('');
      setGenero('');
      setTimeout(() => navigate('/list-client'), 1500);
    } catch (err) {
      console.error("Error al crear cliente:", err);
      setError(err.response?.data?.message || "No se pudo crear el cliente. Revisa los datos ingresados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div style={styles.container}>
        <nav className="app-nav">
          <Link to="/list-client" className="nav-link">Lista de Clientes</Link>
          <Link to="/create-client" className="nav-link">Crear Cliente</Link>
        </nav>
        <h2 style={styles.title}>Crear Cliente</h2>

        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Apellidos:</label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Género:</label>
          <select value={genero} onChange={(e) => setGenero(e.target.value)} style={styles.select} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creando..." : "Crear Cliente"}
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
}

// Estilos básicos en línea
const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default CreateClient;
