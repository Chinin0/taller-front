import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function EditClient() {
  const { id } = useParams(); // Obtener el ID del cliente desde la URL
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    telefono: '',
    genero: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/clientes/${id}`);
        setCliente(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el cliente');
      }
    };
    fetchCliente();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar datos al backend para actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:8000/api/clientes/update/${id}`, cliente);
      navigate('/list-client'); // Redirigir a la lista de clientes
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <nav className="app-nav">
        <Link to="/list-client" className="nav-link">Lista de Clientes</Link>
      </nav>
      <h2 style={styles.title}>Editar Cliente</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={cliente.nombre}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Apellidos:</label>
        <input
          type="text"
          name="apellidos"
          value={cliente.apellidos}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Fecha de Nacimiento:</label>
        <input
          type="date"
          name="fecha_nacimiento"
          value={cliente.fecha_nacimiento}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Teléfono:</label>
        <input
          type="tel"
          name="telefono"
          value={cliente.telefono}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Género:</label>
        <select
          name="genero"
          value={cliente.genero}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="">Selecciona</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}

// Estilos reutilizados
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
};

export default EditClient;
