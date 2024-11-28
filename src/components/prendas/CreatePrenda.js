// frontend/src/components/CreatePrenda.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';


function CreatePrenda() {
    const [clientes, setClientes] = useState([]); // Lista de clientes
    const [cliente, setCliente] = useState(''); // Cliente seleccionado
    const [descripcion, setDescripcion] = useState('');
    const [valorEstimado, setValorEstimado] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaRecepcion, setFechaRecepcion] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const [error, setError] = useState(null); // Manejo de errores
    const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Token de autenticación

    // Cargar la lista de clientes desde la API
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
                console.error('Error al cargar los clientes:', error);
                setError('No se pudo cargar la lista de clientes.');
            }
        };
        fetchClientes();
    }, [token]);

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                cliente,
                descripcion,
                valor_estimado: valorEstimado,
                estado,
                fecha_recepcion: fechaRecepcion,
                fecha_devolucion: fechaDevolucion,
            };

            await axios.post('http://localhost:8000/api/prendas/create', payload, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setSuccessMessage('Prenda registrada exitosamente.');
            setTimeout(() => {
                navigate('/prendas'); // Redirige a la lista de prendas
            }, 2000);
        } catch (error) {
            console.error('Error al registrar la prenda:', error);
            setError('No se pudo registrar la prenda. Por favor, verifica los datos.');
        }
    };

    return (
        <SidebarLayout>
            <div style={styles.container}>
                <nav className="app-nav">
                    <Link to="/prendas" className="nav-link">Lista de Prendas</Link>
                    <Link to="/prendas/create" className="nav-link">Registrar Prenda</Link>
                </nav>
                <h1 style={styles.title}>Registrar Prenda</h1>

                {error && <p style={styles.error}>{error}</p>}
                {successMessage && <p style={styles.success}>{successMessage}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Cliente</label>
                    <select
                        style={styles.input}
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre} {cliente.apellidos}
                            </option>
                        ))}
                    </select>

                    <label style={styles.label}>Descripción</label>
                    <textarea
                        style={styles.input}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Valor Estimado</label>
                    <input
                        type="number"
                        step="0.01"
                        style={styles.input}
                        value={valorEstimado}
                        onChange={(e) => setValorEstimado(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Estado</label>
                    <input
                        type="text"
                        style={styles.input}
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Fecha de Recepción</label>
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={fechaRecepcion}
                        onChange={(e) => setFechaRecepcion(e.target.value)}
                        required
                    />

                    <label style={styles.label}>Fecha de Devolución</label>
                    <input
                        type="datetime-local"
                        style={styles.input}
                        value={fechaDevolucion}
                        onChange={(e) => setFechaDevolucion(e.target.value)}
                    />

                    <button type="submit" style={styles.button}>
                        Registrar Prenda
                    </button>
                </form>
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

export default CreatePrenda;
