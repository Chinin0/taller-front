import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';

function PrendaDetails() {
    const { id } = useParams(); // Obtener el ID de la prenda de la URL
    const [prenda, setPrenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPrendaDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/prendas/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const prendaData = response.data;
    
                // Si el cliente solo tiene ID, busca los detalles del cliente
                if (prendaData.cliente && typeof prendaData.cliente === 'number') {
                    const clienteResponse = await axios.get(`http://localhost:8000/api/clientes/${prendaData.cliente}`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                    prendaData.cliente = clienteResponse.data; // Añade detalles del cliente
                }
    
                setPrenda(prendaData);
            } catch (error) {
                setError(
                    error.response?.data?.detail ||
                    error.message ||
                    'Ocurrió un error al cargar los detalles de la prenda'
                );
            } finally {
                setLoading(false);
            }
        };
    
        fetchPrendaDetails();
    }, [id, token]);
    

    return (
        <SidebarLayout>
            <div style={styles.container}>
                <nav className="app-nav">
                    <Link to="/prendas" className="nav-link">Lista de Prendas</Link>
                </nav>

                <h1 style={styles.title}>Detalles de la Prenda</h1>

                {loading && <p style={styles.loading}>Cargando detalles...</p>}

                {error && <p style={styles.error}>{error}</p>}

                {!loading && !error && prenda && (
                    <div style={styles.detailsContainer}>
                        <h3>Descripción</h3>
                        <p>{prenda.descripcion}</p>

                        <h3>Valor Estimado</h3>
                        <p>{prenda.valor_estimado}</p>

                        <h3>Estado</h3>
                        <p>{prenda.estado}</p>

                        <h3>Cliente</h3>
                        <p>{prenda.cliente ? `${prenda.cliente.nombre} ${prenda.cliente.apellidos}` : 'No disponible'}</p>

                        <button onClick={() => navigate(`/prendas/editar/${prenda.id}`)} style={styles.button}>
                            Editar
                        </button>
                    </div>
                )}
            </div>
        </SidebarLayout>
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
    detailsContainer: {
        marginTop: '20px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
};

export default PrendaDetails;
