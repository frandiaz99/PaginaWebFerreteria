import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"
import Modal from '../components/Modal'

function IniciarSesion() {
    const [dni_pass_correctos,setDni_pass_correctos]= useState(true)
    const [passIncorrecta, setPassIncorrecta]= useState(false)
    const [userBloqued, setUserBloqued]= useState(false)
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
        setDni_pass_correctos(true)
        setPassIncorrecta(false)
        setUserBloqued(false)
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
                        throw new Error(`${data.message || ''}-${data.intento || ''}`);
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
            .catch(error => {
                const errorArray= error.message.split('-')
                console.error("Error en el inicio:", errorArray);
                if (errorArray[0] == 'User bloqued'){
                    const intento= errorArray[1]
                    if (intento == '2'){
                        setPassIncorrecta(true)
                        setUserBloqued(true)
                    }else if(intento > '2'){
                        setUserBloqued(true)
                    }
                }else{
                    setDni_pass_correctos(false)
                }
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

                    {!dni_pass_correctos && <p style={{color: 'red'}}>El DNI o la contraseña son incorrectos</p>}
                    {passIncorrecta && <p style={{color: 'red'}}>Contraseña incorrecta</p> }
                    <Modal texto={'Tu cuenta se encuentra bloqueada, para desbloquearla comunicate con un administrador: fedeteria@gmail.com'} 
                    confirmacion={userBloqued} setConfirmacion={setUserBloqued} />
                    
                    <div className="divIniciarSesion">
                        <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                    </div>
                </div>
        </main>
    )
}

export default IniciarSesion
