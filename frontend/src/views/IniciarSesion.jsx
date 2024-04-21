import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"
import usuario from "../data/usuario.json"  //prueba

function IniciarSesion() {
    const [intento,setIntento]= useState(1)  //se obtiene del back??
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

    const handleIniciar= () =>{ 
        //Se obtiene datos del usuario mediante su dni con un Fetch
        if (usuario){
            if (usuario.bloqueado){
                alert('Tu cuenta está bloqueada, por favor comunicate con blabla')
            } else if (usuario.dni === datos.dni && usuario.contrasenia === datos.contrasenia){ 
                localStorage.setItem('user', JSON.stringify(usuario))
                navigate(routes.userPrincipal)
            }else if(usuario.contrasenia !== datos.contrasenia){
                setIntento(intento+1)
                if (intento == 3){
                    //fetch para bloquear cuenta
                    alert('Contraseña incorrecta, tu cuenta fue bloqueada comunicate con blabla')
                }else{
                    alert('El DNI o la contraseña son incorrectas')
                }
            }
        } else{
            alert('El DNI o la contraseña son incorrectas')
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
                        type="number"
                        placeholder="Ingresá tu DNI"
                        onChange={handleChange}
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
                        />
                    </div> 

                    <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                </div>
        </main>
    )
}

export default IniciarSesion
