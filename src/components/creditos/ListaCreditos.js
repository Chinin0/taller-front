// ListaCreditos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';

function ListaCreditos() {
    const [creditos, setCreditos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCreditos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/credito', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setCreditos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los créditos:', error);
                setError('No se pudieron cargar los créditos');
                setLoading(false);
            }
        };

        fetchCreditos();
    }, [token]);

    const handleEliminarCredito = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este crédito?')) {
            try {
                await axios.delete(`http://localhost:8000/api/credito/delete/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setCreditos(creditos.filter(credito => credito.id !== id));
            } catch (error) {
                console.error('Error al eliminar el crédito:', error);
                setError('No se pudo eliminar el crédito');
            }
        }
    };

    if (loading) return <div style={styles.loading}>Cargando créditos...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <SidebarLayout>
            <div style={styles.container}>
                <nav className="app-nav">
                    <Link to="/creditos" className="nav-link">Lista de Créditos</Link>
                    <Link to="/creditos/create" className="nav-link">Registrar Crédito</Link>
                </nav>
                <h1 style={styles.title}>Lista de Créditos</h1>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Monto</th>
                            <th>Fecha Aprobación</th>
                            <th>Fecha Vencimiento</th>
                            <th>Tasa Interés</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditos.map((credito) => (
                            <tr key={credito.id}>
                                <td>{credito.id}</td>
                                <td>{credito.cliente}</td>
                                <td>${credito.monto}</td>
                                <td>{new Date(credito.fecha_aprobacion).toLocaleDateString()}</td>
                                <td>{new Date(credito.fecha_vencimiento).toLocaleDateString()}</td>
                                <td>{credito.tasa_interes}%</td>
                                <td>{credito.estado_credito}</td>
                                <td>
                                    <button
                                        style={styles.buttonEdit}
                                        onClick={() => navigate(`/creditos/editar/${credito.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        style={styles.buttonDelete}
                                        onClick={() => handleEliminarCredito(credito.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SidebarLayout>
    );
}

// CrearCredito.js
function CrearCredito() {
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState('');
    const [solicitud, setSolicitudes] = useState([]);
    const [prenda, setPrenda] = useState([]);
    const [monto, setMonto] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [tasaInteres, setTasaInteres] = useState('');
    const [estadoCredito, setEstadoCredito] = useState('VIGENTE');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/clientes', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setClientes(response.data);
            } catch (error) {
                console.error('Error al cargar clientes:', error);
                setError('No se pudieron cargar los clientes');
            }
        };
        const fetchSolicitudes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/solicitudes/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setSolicitudes(response.data);
            } catch (error) {
                console.error('Error al cargar solicitudes:', error);
                setError('No se pudieron cargar las solicitudes');
            }
        };
        fetchClientes();
        fetchSolicitudes();
    }, [token]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                cliente: cliente,  // Asegúrate de que este es el ID del cliente
                solicitud: solicitud,  // Deberías obtener el ID de la solicitud de crédito
                prenda: prenda,  // Opcional, dependiendo de tu lógica de negocio
                monto: monto,
                fecha_vencimiento: fechaVencimiento,
                tasa_interes: tasaInteres,
                estado_credito: estadoCredito
            };

            await axios.post('http://localhost:8000/api/credito/create', payload, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSuccessMessage('Crédito registrado exitosamente');
            setTimeout(() => navigate('/creditos'), 2000);
        } catch (error) {
            console.error('Error al registrar crédito:', error);
            setError('No se pudo registrar el crédito');
        }
    };

    return (
        <SidebarLayout>
            <div style={styles.container}>
                <h1 style={styles.title}>Registrar Crédito</h1>

                {error && <p style={styles.errorMessage}>{error}</p>}
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Cliente</label>
                    <select
                        style={styles.input}
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre} {c.apellidos}
                            </option>
                        ))}
                    </select>
                    <label style={styles.label}>Solicitud</label>
                    <select
                        style={styles.input}
                        value={solicitud}
                        onChange={(e) => setSolicitudes(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una solicitud</option>
                        {Array.isArray(solicitud) && solicitud.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.descripcion}
                            </option>
                        ))}

                    </select>

                    <label style={styles.label}>Prenda</label>
                    <select
                        style={styles.input}
                        value={prenda}
                        onChange={(e) => setPrenda(e.target.value)}
                    >
                        <option value="">Selecciona una prenda (opcional)</option>
                        {prenda.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.descripcion}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Monto del Crédito</label>
                    <input
                        type="number"
                        style={styles.input}
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Fecha de Vencimiento</label>
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Tasa de Interés (%)</label>
                    <input
                        type="number"
                        step="0.01"
                        style={styles.input}
                        value={tasaInteres}
                        onChange={(e) => setTasaInteres(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Estado del Crédito</label>
                    <select
                        style={styles.input}
                        value={estadoCredito}
                        onChange={(e) => setEstadoCredito(e.target.value)}
                        required
                    >
                        <option value="VIGENTE">Vigente</option>
                        <option value="TERMINADO">Terminado</option>
                        <option value="INCUMPLIDO">Incumplido</option>
                    </select>

                    <button type="submit" style={styles.button}>
                        Registrar Crédito
                    </button>
                </form>
            </div>
        </SidebarLayout>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonEdit: {
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '5px 10px',
        margin: '0 5px',
        border: 'none',
        borderRadius: '3px',
    },
    buttonDelete: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '3px',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
    },
};

export { ListaCreditos, CrearCredito };