// frontend/src/components/CreateClient.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateClient() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:8000/api/clientes/create', {
        nombre,
        apellidos,
        fecha_nacimiento: fechaNacimiento,
        telefono,
        genero,
      });
      alert("Cliente creado exitosamente");
    } catch (err) {
      console.error("Error al crear cliente:", err);
      setError("No se pudo crear el cliente. Revisa los datos ingresados.");
    }
  };

  return (
    <div>
      <h2>Crear Cliente</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        
        <label>Apellidos:</label>
        <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
        
        <label>Fecha de Nacimiento:</label>
        <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
        
        <label>Teléfono:</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        
        <label>Género:</label>
        <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
          <option value="">Selecciona</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        
        <button type="submit">Crear Cliente</button>
      </form>
    </div>
  );
}

export default CreateClient;
