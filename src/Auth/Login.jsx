import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '.././components/css/login.css'


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar recargar la página
        setError(""); // Limpiar errores previos
        try {
            const response = await axios.post("http://localhost:8000/login", {
                username,
                password,
            });

            // Guardar el token y el username en localStorage
            const token = response.data.token;
            const first_name = response.data.user.first_name;
            const email = response.data.user.email;
            localStorage.setItem("token", token);
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("email" , email);
            navigate("/welcome"); // Redirigir a la vista Welcome
        } catch (err) {
            setError(err.response?.data?.error || "Error al iniciar sesión"); // Mostrar mensaje de error genérico
        }
    };

    return (
        <div className="container">

            <div className="container-cards ">
                <div className="login-container">
                    <div className="login-box">
                        <div className="login-text">
                                <h2 className="login-h2">
                                    Login
                                </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-session">
                                Iniciar Sesión
                            </button>
                            
                        </form>
                            <button className="btn-register" 
                                onClick={() => navigate('/register')}
                            >
                                Registrar
                            </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Login;


