import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"
import usuario from "../data/usuario.json"  //prueba

function IniciarSesion() {
    const [datos,setDatos]= useState({
        dni:'',
        contrasenia:''
    })

    const navigate= useNavigate()
    
    const handleChange = (e) => {
        setDatos({
          ...datos,
          [e.target.name]: e.target.value,
        })
    }

    const handleKeyDown= (e)=>{
        if (e.key === 'Enter'){
            if (e.target.name === 'dni'){
                document.getElementById('contrasenia').focus()
            }else if (e.target.name === 'contrasenia'){
                handleIniciar()
            }
        }
    }

    const handleIniciar= () =>{ //fetch para obtener datos de usuario
        console.log(datos)
        if (usuario.dni === datos.dni && usuario.contrasenia === datos.contrasenia){
            alert('bien')
            localStorage.setItem('user', JSON.stringify(usuario)) //Almacenar lo que llegue por el back
            navigate(routes.userPrincipal)
        }else{
            alert('datos errones')
        }
    }

    return(
        <main className="main">
                <h1>Iniciar Sesion</h1>
                <div className="labels">

                    <p>Si no tenes una cuenta podes registrarte <Link to={routes.crearCuenta} style={{textDecoration:'none'}}><span>acá</span></Link></p>

                    <div className="label">
                        <label htmlFor="dni">DNI</label>
                        <input
                        id="dni"
                        name="dni"
                        type="text"
                        placeholder="Ingresá tu DNI"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        /> 
                    </div>
                    
                    <div className="label">
                        <label htmlFor="contrasenia">Contraseña</label>
                        <input
                        id="contrasenia"
                        name="contrasenia"
                        type="password"
                        placeholder="Ingresá tu contraseña"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        />
                    </div> 

                    <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                </div>
        </main>
    )
}

export default IniciarSesion
