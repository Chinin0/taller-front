import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';

function ListPrendas() {
    const [prendas, setPrendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleEditClick = (id) => {
        navigate(`/prendas/editar/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta prenda?')) {
            try {
                await axios.delete(`http://localhost:8000/api/prendas/delete/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setPrendas((prevPrendas) => prevPrendas.filter(prenda => prenda.id !== id));
            } catch (error) {
                console.error("Error al eliminar prenda:", error);
                alert('No se pudo eliminar la prenda. Intenta nuevamente.');
            }
        }
    };

    useEffect(() => {
        const fetchPrendas = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/prendas', {
                    headers: {
                        Authorization: `Token ${token}`
                    },
                });
                setPrendas(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.detail ||
                    error.message ||
                    'Ocurrió un error desconocido'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchPrendas();
    }, [token]);

    return (

        <SidebarLayout>
            <div style={styles.container}>



                <nav className="app-nav">
                    <Link to="/prendas" className="nav-link">Lista de Prendas</Link>
                    <Link to="/prendas/create" className="nav-link">Registrar Prenda</Link>
                </nav>

                <h1 style={styles.title}>Lista de Prendas</h1>

                {loading && <p style={styles.loading}>Cargando prendas...</p>}

                {error && <p style={styles.error}>{error}</p>}

                {!loading && !error && prendas.length > 0 && (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Valor Estimado</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prendas.map((prenda) => (
                                    <tr key={prenda.id}>
                                        <td>
                                            <Link to={`/prendas/${prenda.id}`} style={styles.link}>
                                                {prenda.descripcion}
                                            </Link>
                                        </td>
                                        <td>{prenda.valor_estimado}</td>
                                        <td>{prenda.estado}</td>
                                        <td>
                                            <button style={styles.button} onClick={() => handleEditClick(prenda.id)}>
                                                Editar
                                            </button>
                                            <button style={styles.deleteButton} onClick={() => handleDelete(prenda.id)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && prendas.length === 0 && (
                    <p style={styles.noPrendasMessage}>No hay prendas disponibles.</p>
                )}

            </div>
        </SidebarLayout >
    );
}

const styles = {
    container: {
        maxWidth: '700px',
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
    loading: {
        textAlign: 'center',
        fontSize: '16px',
        color: '#666',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableContainer: {
        marginTop: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
        fontWeight: 'bold',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    noPrendasMessage: {
        textAlign: 'center',
        color: '#666',
        fontSize: '16px',
    },
};

export default ListPrendas;
