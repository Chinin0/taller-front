// frontend/src/components/ListSolicitudes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';
import { useNavigate } from 'react-router-dom';

function ListSolicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleEditClick = (id) => {
        navigate(`/solicitudes/editar/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
            try {
                await axios.delete(`http://localhost:8000/api/solicitudes/${id}/delete`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSolicitudes((prevSolicitudes) => prevSolicitudes.filter((solicitud) => solicitud.id !== id));
            } catch (error) {
                console.error("Error al eliminar solicitud:", error);
                alert('No se pudo eliminar la solicitud. Intenta nuevamente.');
            }
        }
    };

    useEffect(() => {
        const fetchSolicitudes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/solicitudes/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSolicitudes(response.data);
            } catch (error) {
                setError(error.response?.data?.detail || 'Ocurrió un error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitudes();
    }, [token]);

    return (
        <SidebarLayout>
            <div style={styles.container}>
                <h1>Lista de Solicitudes de Crédito</h1>

                {loading && <p className="loading-message">Cargando solicitudes...</p>}

                {error && <p className="error-message">Error: {error}</p>}

                {!loading && !error && solicitudes.length > 0 && (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Monto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((solicitud) => (
                                <tr key={solicitud.id}>
                                    <td>
                                        <Link to={`/solicitudes/${solicitud.id}`}>{solicitud.nombre}</Link>
                                    </td>
                                    <td>{solicitud.monto}</td>
                                    <td>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => handleEditClick(solicitud.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(solicitud.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && !error && solicitudes.length === 0 && (
                    <p>No hay solicitudes disponibles.</p>
                )}
            </div>
        </SidebarLayout>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px',
        marginRight: '5px',
        border: 'none',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '10px',
        border: 'none',
        cursor: 'pointer',
    },
};

export default ListSolicitudes;
