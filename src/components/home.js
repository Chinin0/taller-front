// frontend/src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Home.css'; // Archivo CSS para estilos

function Home() {
    const [clientes, setClientes] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/clientes/')  // ruta del endpoint en Django
            .then(response => {
                setClientes(response.data); // Guardamos la lista de clientes en el estado
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);


    return (
        <div className="home-container">
            <h1 className="home-title">Lista de Clientes</h1>

            {loading && <p className="loading-message">Cargando clientes...</p>}

            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && (
                <ul className="clientes-list">
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <li key={cliente.id} className="cliente-item">
                                {cliente.nombre} {cliente.apellidos}
                            </li>
                        ))
                    ) : (
                        <p className="no-clientes-message">No hay clientes disponibles.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Home;
