import axios from "axios";
import React, { useState } from "react";
import { useNavigate} from "react-router-dom";

import '.././components/css/register.css'

const Register = () =>{
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [username ,  setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async(event) => {
        event.preventDefault();
        setError("");
        try{
            const response = await axios.post('http://localhost:8000/register',{
                nombre,
                apellidos,
                username,
                email,
                password,
            });
            if(response.status === 201){
                navigate("/");
            }
            
        }catch(err){
            setError(err.response?.data?.error || 'Error al registrase');
        }

    }




    return (
        <div className="container">
            <div className="container-register">
                <div className="box-register">
                    <div className="cards-register">
                        <div className="register">
                            <h3 className="h-register">Registrar nuevo usuario</h3>
                        </div>
                        <form className="form-register" onSubmit={handleRegister}>
                            <div className="">
                            <label htmlFor="">Nombre</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                            <label htmlFor="">Apellido</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                required
                            />
                            <label htmlFor="">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="">Email</label>
                            <input 
                                type="email"
                                className="form-control" 
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="btn-register">
                                Resgistrar
                            </button>
                            </div>
                            
                        </form>
                        <button 
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/")}
                            >
                            Cancelar
                        </button>
                        
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Register;