// frontend/src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './../css/ListClient.css'; // Archivo CSS para estilos
import './../css/ClientDetails.css';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';

function ListClients() {
    const [clientes, setClientes] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Recuperar el token almacenado


    const handleEditClick = (id) => {
        navigate(`/clientes/editar/${id}`);
    };
    const handleAddDetails = () => {
        navigate('/detalle-cliente/create');
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8000/api/clientes/delete/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                // Actualizar el estado para reflejar la eliminación
                setClientes((prevClientes) => prevClientes.filter(cliente => cliente.id !== id));
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                alert('No se pudo eliminar el cliente. Intenta nuevamente.');
            }
        }
    };


    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/clientes', {
                    headers: {
                        Authorization: `Token ${token}` // Asegúrate de pasar un token válido
                    },
                });
                setClientes(response.data);
            } catch (error) {
                setError(error.response?.data?.detail || 'Ocurrió un error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchClientes();
    }, [token]);

    return (
        <SidebarLayout>
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
                                            <button className="btn-delete" onClick={() => handleDelete(cliente.id)}>
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
        </SidebarLayout>
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