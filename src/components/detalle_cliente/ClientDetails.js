import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SidebarLayout from '../SidebarLayout';

function ClientDetails() {
    const { id } = useParams(); // Obtiene el id del cliente desde la URL
    const [cliente, setCliente] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token'); // Recuperar el token almacenado

    useEffect(() => {
        const fetchClienteYDetalles = async () => {
            if (!token) {
                setError('Token no encontrado. Por favor inicia sesión.');
                setLoading(false);
                return;
            }

            try {
                // Solicitar datos del cliente
                const clienteResponse = await axios.get(`http://localhost:8000/api/clientes/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`
                    },
                });
                setCliente(clienteResponse.data);

                // Solicitar detalles del cliente
                const detallesResponse = await axios.get(`http://localhost:8000/api/detalle-cliente/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`
                    },
                });
                setDetalles(detallesResponse.data); // Actualiza los detalles del cliente

                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('No estás autenticado. Por favor inicia sesión.');
                } else {
                    setError(err.message || 'Ocurrió un error desconocido.');
                }
                setLoading(false);
            }
        };

        fetchClienteYDetalles();
    }, [id, token]);

    if (loading) {
        return <p>Cargando datos del cliente...</p>;
    }

    if (error) {
        return <p className="text-red-500 font-bold">Error: {error}</p>;
    }

    if (!cliente) {
        return <p>No se encontraron datos para este cliente.</p>;
    }
    return (
        <SidebarLayout>
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Detalles del Cliente</h1>
            <div className="bg-gray-100 p-4 rounded shadow">
                <p><strong>Nombre:</strong> {cliente.nombre} {cliente.apellidos}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono || 'No disponible'}</p>
                <p><strong>Email:</strong> {cliente.email || 'No disponible'}</p>
                <p><strong>Dirección:</strong> {cliente.direccion || 'No disponible'}</p>
            </div>
            <h2 className="text-xl font-semibold mt-6">Historial de Detalles</h2>
            {detalles.length > 0 ? (
                <ul className="mt-4">
                    {detalles.map((detalle) => (
                        <li key={detalle.id} className="mb-4 p-4 bg-gray-50 rounded shadow">
                            <p><strong>Detalle:</strong> {detalle.detalle}</p>
                            <p><strong>Ocupación:</strong> {detalle.ocupacion}</p>
                            <p><strong>Tipo de ocupación:</strong> {detalle.tipo_ocupacion}</p>
                            <p><strong>Fecha de inicio:</strong> {new Date(detalle.fecha_inicio_ocupacion).toLocaleDateString()}</p>
                            <p><strong>Total ingresos:</strong> {detalle.total_ingresos}</p>
                            <hr className="my-2" />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4">No hay detalles registrados para este cliente.</p>
            )}
        </div>
        </SidebarLayout>
    );
}
export default ClientDetails;