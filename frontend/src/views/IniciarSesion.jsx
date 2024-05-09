import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"
import Modal from '../components/Modal'

function IniciarSesion() {
    const [autenticacion, setAutenticacion]= useState(false)
    const [dni_pass_correctos,setDni_pass_correctos]= useState(true)
    const [passIncorrecta, setPassIncorrecta]= useState(false)
    const [userBloqued, setUserBloqued]= useState(false)
    const [datos,setDatos]= useState({
        dni:'',
        password:'',
        code: ''
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
        if (datos.dni !== '' && datos.password !== ''){
            //Podría ir una pantalla de carga
            fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ User: datos }),
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                   return response.json().then(data => {
                        throw new Error(JSON.stringify({message: data.message, status: data.status}));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Inicio exitoso:", data)
                if (data.User.rol == 2 || data.User.rol == 3){
                    if (autenticacion) setAutenticacion(true)
                    else{
                        if (data.User.rol == 2){
                            localStorage.setItem('cuentaActual', 'usuario')
                        }
                        localStorage.setItem('user', JSON.stringify(data.User))
                        navigate(routes.userPrincipal)
                    }
                }
                else{
                    localStorage.setItem('user', JSON.stringify(data.User))
                    navigate(routes.userPrincipal)
                } 
            })
            .catch(error => {
                const errorData= JSON.parse(error.message)
                if (errorData.status == 405 || errorData.status == 404) {
                    setDni_pass_correctos(false)
                }
                else if (errorData.status == 406){
                    setPassIncorrecta(true)
                    setUserBloqued(true)
                }
                else if (errorData.status == 407) setUserBloqued(true)
                else console.log(errorData.message)
            });
        }
    }



    return(
        <main className="main">
            {autenticacion
             ?
             <>
                <h2 style={{marginBottom:'20px'}}>Autenticación</h2>
                <div className="labels">
                    <div className="label">
                        <label htmlFor="autenticacion">Ingresa el código que se envío a tu email</label>
                        <input type="text" name='code' onChange={handleChange} />
                        <button className="iniciar" onClick={handleIniciar}>Confirmar</button>
                    </div>
                </div>
             </>
             :
             <>
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
                    confirmacion={userBloqued} setConfirmacion={setUserBloqued} ok={true}/>
                    
                    <div className="divIniciarSesion">
                        <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                    </div>
                </div>
                </>
                }

        </main>
    )
}

export default IniciarSesion
