// frontend/src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './../css/ListClient.css'; // Archivo CSS para estilos
import './../css/ClientDetails.css';
import { useNavigate } from 'react-router-dom';

function ListClients() {
    const [clientes, setClientes] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleEditClick = (id) => {
        navigate(`/clientes/editar/${id}`);
    };
    const handleAddDetails = () => {
        navigate('/detalle-cliente/create');
    };

    useEffect(() => {
        axios.get('http://localhost:8000/api/clientes/')  // ruta del endpoint en Django
            .then(response => {
                setClientes(response.data); // Guardamos la lista de clientes en el estado
                setLoading(false);
            })
            .catch(error => {
                setError(error.message || 'Ocurrió un error desconocido');
                setLoading(false);
            });
    }, []);


    return (
        <div style={styles.container}>
            <nav className="app-nav">
                <Link to="/list-client" className="nav-link">Lista_Clientes</Link>
                <Link to="/create-client" className="nav-link">Crear Cliente</Link>
            </nav>
            <h1 className="home-title">Lista de Clientes</h1>

            {loading && <p className="loading-message">Cargando clientes...</p>}

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && clientes.length > 0 && (
                <div className="clientes-table-container">
                    <table className="clientes-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>
                                        <Link
                                            to={`/clientes/${cliente.id}`} // Ruta dinámica hacia la vista de detalles
                                            className="cliente-link"
                                        >
                                            {cliente.nombre} {cliente.apellidos}
                                        </Link>
                                    </td>
                                    <td>{cliente.telefono || 'No disponible'}</td>
                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditClick(cliente.id)}
                                        >
                                            Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => alert(`Eliminar cliente: ${cliente.nombre} ${cliente.apellidos}`)}>
                                            Eliminar
                                        </button>
                                        <button
                                            className="btn-add-details"
                                            onClick={handleAddDetails}
                                        >
                                            Agregar Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && clientes.length === 0 && (
                <p className="no-clientes-message">No hay clientes disponibles.</p>
            )}
        </div>
    );
}
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
    buttonHover: {
        backgroundColor: '#45a049',
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
export default ListClients;
