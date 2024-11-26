import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ClientDetails() {
    const { id } = useParams(); // Obtiene el id del cliente desde la URL
    const [cliente, setCliente] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClienteYDetalles = async () => {
            try {
                const clienteResponse = await axios.get(`http://localhost:8000/api/clientes/${id}`);
                const detallesResponse = await axios.get(`http://localhost:8000/api/detalle-cliente/${id}`);
                
                setCliente(clienteResponse.data); // Datos del cliente
                setDetalles(detallesResponse.data); // Detalles del cliente
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Ocurrió un error desconocido');
                setLoading(false);
            }
        };

        fetchClienteYDetalles();
    }, [id]);

    if (loading) {
        return <p>Cargando datos del cliente...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!cliente) {
        return <p>No se encontraron datos para este cliente.</p>;
    }

    return (
        <div>
            <h1>Detalles del Cliente</h1>
            <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellidos}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono || 'No disponible'}</p>
            <p><strong>Email:</strong> {cliente.email || 'No disponible'}</p>
            <p><strong>Dirección:</strong> {cliente.direccion || 'No disponible'}</p>

            <h2>Historial de Detalles</h2>
            {detalles.length > 0 ? (
                <ul>
                    {detalles.map((detalle) => (
                        <li key={detalle.id}>
                            <p><strong>Detalle:</strong> {detalle.detalle}</p>
                            <p><strong>Ocupación:</strong> {detalle.ocupacion}</p>
                            <p><strong>Tipo de ocupación:</strong> {detalle.tipo_ocupacion}</p>
                            <p><strong>Fecha de inicio:</strong> {detalle.fecha_inicio_ocupacion}</p>
                            <p><strong>Total ingresos:</strong> {detalle.total_ingresos}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay detalles registrados para este cliente.</p>
            )}
        </div>
    );
}

export default ClientDetails;
