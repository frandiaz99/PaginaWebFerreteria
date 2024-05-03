import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"

function IniciarSesion() {
    const [passCorrecta,setPassCorrecta]= useState(true)
    const [datos,setDatos]= useState({
        dni:'',
        password:''
    })

    const navigate= useNavigate()
    
    const handleChange = (e) => {
        setDatos({
          ...datos,
          [e.target.name]: e.target.value,
        })
    }

    const handleIniciar= () =>{ 
        console.log(datos)
        if (datos.dni !== '' && datos.password !== ''){
            //Podría ir una pantalla de carga
            fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ User: datos }),
                credentials: "include"
            })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Error al iniciar");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Inicio exitoso:", data)
                localStorage.setItem('user', JSON.stringify(data.User))
                if (data.User.rol == 2){
                    localStorage.setItem('cuentaActual', 'usuario')
                }
                navigate(routes.userPrincipal)
            })
            .catch(error => { //Hay que ver como manejar lo de los bloqueos para informarlo
                console.error("Error en el inicio:", error.message);
                setPassCorrecta(false)
            });
        }
    }



    return(
        <main className="main">
                <h2 style={{marginBottom:'20px'}}>Iniciar Sesion</h2>
                <div className="labels">
                    
                    <p className="siNoTenesCuenta">Si no tenes una cuenta podes registrarte<Link to={routes.crearCuenta} className="boton"><span className="linkAca">acá</span></Link></p>

                    <div className="label">
                        <label htmlFor="dni">DNI</label>
                        <input
                        name="dni"
                        type="number"
                        placeholder="Ingresá tu DNI"
                        onChange={handleChange}
                        /> 
                    </div>
                    
                    <div className="label">
                        <label htmlFor="password">Contraseña</label>
                        <input
                        name="password"
                        type="password"
                        placeholder="Ingresá tu contraseña"
                        onChange={handleChange}
                        />
                    </div> 
                    {!passCorrecta && <p style={{color: 'red'}}>El DNI o la contraseña son incorrectos</p>}

                    <div className="divIniciarSesion">
                        <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                    </div>
                </div>
        </main>
    )
}

export default IniciarSesion
