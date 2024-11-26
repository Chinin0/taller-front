import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirección

function CreateClientDetails() {
    const [detalle, setDetalle] = useState('');
    const [ocupacion, setOcupacion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [total_ingresos, setTotal_ingresos] = useState('');
    const [tipo_ocupacion, setTipo_ocupacion] = useState('');
    const [fk_cliente, setFk_cliente] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado para manejar el envío
    const navigate = useNavigate(); // Hook para redirigir


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        setLoading(true); // Activamos el estado de carga

        if (!detalle || !ocupacion || !fechaInicio || !total_ingresos || !tipo_ocupacion || !fk_cliente) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/detalle-cliente/create', {
                detalle,
                ocupacion,
                fecha_inicio_ocupacion: fechaInicio,
                total_ingresos,
                tipo_ocupacion,
                fk_cliente,
            });
            setSuccessMessage("Cliente creado exitosamente.");

            setTimeout(() => navigate('/list-client'), 1500); // Redirigimos tras 1.5 segundos
        } catch (err) {
            console.error("Error al crear cliente:", err);
            setError(err.response?.data?.message || "No se pudo crear el cliente. Revisa los datos ingresados.");
        } finally {
            setLoading(false); // Desactivamos el estado de carga
        }
    };

    return (
        <div style={styles.container}>
            <nav className="app-nav">
                <Link to="/list-client" className="nav-link">Lista de Clientes</Link>
                <Link to="/create-client" className="nav-link">Crear Cliente</Link>
            </nav>
            <h2 style={styles.title}>Registrar detalle del cliente</h2>

            {error && <p style={styles.error}>{error}</p>}
            {successMessage && <p style={styles.success}>{successMessage}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Detalles:</label>
                <input
                    type="text"
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Ocupación:</label>
                <input
                    type="text"
                    value={ocupacion}
                    onChange={(e) => setOcupacion(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Fecha de inicio de ocupacion:</label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Total Ingresos:</label>
                <input
                    type="number"
                    value={total_ingresos}
                    onChange={(e) => setTotal_ingresos(e.target.value)}
                    style={styles.input}
                    required
                />
                <label style={styles.label}>tipo Ocupación:</label>
                <input
                    type="text"
                    value={tipo_ocupacion}
                    onChange={(e) => setTipo_ocupacion(e.target.value)}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>id Cliente:</label>
                <input
                    type="number"
                    value={fk_cliente}
                    onChange={(e) => setFk_cliente(e.target.value)}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Registrando..." : "Registrando Detalle"}
                </button>
            </form>
        </div>
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

export default CreateClientDetails;
