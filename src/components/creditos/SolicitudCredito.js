import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';

function CreateSolicitudCredito() {
    const [clientes, setClientes] = useState([]);
    const [prendas, setPrendas] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [prendaId, setPrendaId] = useState('');
    const [monto, setMonto] = useState('');
    const [tasaInteres, setTasaInteres] = useState('');
    const [estadoSolicitud, setEstadoSolicitud] = useState('');
    const [fechaAprobacion, setFechaAprobacion] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const SOLICITUD_ESTADO_CHOICES = [
        { value: 'PENDIENTE', label: 'Pendiente' },
        { value: 'APROBADO', label: 'Aprobada' },
        { value: 'RECHAZADO', label: 'Rechazada' },
    ];

    useEffect(() => {
        // Cargar los clientes
        const fetchClientes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/clientes', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setClientes(response.data);
            } catch (error) {
                console.error('Error al cargar los clientes', error);
            }
        };

        // Cargar las prendas
        const fetchPrendas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/prendas', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setPrendas(response.data);
            } catch (error) {
                console.error('Error al cargar las prendas', error);
            }
        };

        fetchClientes();
        fetchPrendas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        setLoading(true);

        if (!clienteId || !prendaId || !monto || !tasaInteres) {
            setError("Por favor, completa todos los campos.");
            setLoading(false);
            return;
        }

        const payload = {
            cliente: clienteId,
            prenda: prendaId,
            monto,
            tasa_interes: tasaInteres,
            estado_solicitud: estadoSolicitud || 'PENDIENTE', // Agrega esta línea
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/api/solicitud/',
                payload,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSuccessMessage("Solicitud de crédito registrada exitosamente.");
            setClienteId('');
            setPrendaId('');
            setMonto('');
            setTasaInteres('');
            setTimeout(() => navigate('/list-solicitudes'), 1500);
        } catch (err) {
            console.error("Error al crear la solicitud:", err);
            setError(err.response?.data?.message || "No se pudo registrar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SidebarLayout>
            <div style={styles.container}>

                <h2 style={styles.title}>Crear Solicitud de Crédito</h2>

                {error && <p style={styles.error}>{error}</p>}
                {successMessage && <p style={styles.success}>{successMessage}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Cliente:</label>
                    <select
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre} {cliente.apellidos}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Prenda:</label>
                    <select
                        value={prendaId}
                        onChange={(e) => setPrendaId(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Selecciona una prenda</option>
                        {prendas.map((prenda) => (
                            <option key={prenda.id} value={prenda.id}>
                                {prenda.descripcion}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Monto:</label>
                    <input
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <label style={styles.label}>Tasa de Interés (%):</label>
                    <input
                        type="number"
                        value={tasaInteres}
                        onChange={(e) => setTasaInteres(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Estado de Solicitud:</label>
                    <select
                        value={estadoSolicitud}
                        onChange={(e) => setEstadoSolicitud(e.target.value)}
                        style={styles.input}
                        required
                    >
                        <option value="">Selecciona un estado</option>
                        {SOLICITUD_ESTADO_CHOICES.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Fecha de Aprobación:</label>
                    <input
                        type="datetime-local"
                        value={fechaAprobacion}
                        onChange={(e) => setFechaAprobacion(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Registrando..." : "Crear Solicitud"}
                    </button>
                </form>
            </div>
        </SidebarLayout>
    );
}

// Estilos básicos en línea
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
    success: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

export default CreateSolicitudCredito;
