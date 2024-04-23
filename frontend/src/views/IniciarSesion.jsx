import "../styles/IniciarSesion.css"
import { Link , useNavigate} from "react-router-dom"
import routes from "../routes"
import { useState } from "react"

function IniciarSesion() {
    const [intento,setIntento]= useState(1)  //se obtiene del back??
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
        if (datos.dni !== '' && datos.password !== ''){
            //Podría ir una pantalla de carga
            fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ User: datos }),
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
                localStorage.setItem('user', JSON.stringify(data))
               //Tengo que saber el rol para ver si mandar a pagPrincipal de user o pagPrincipal de admin (si es emple igual lo mado a pag principal de user)
                navigate(routes.pagPrincipal);
            })
            .catch(error => { //Hay que informar cuando se bloquea la cuenta y que se comunique con un administrador
                console.error("Error en el inicio:", error.message);
                alert('El DNI o la contraseña son incorrectas')
            });
        }
        /*if (usuario){
            if (usuario.bloqueado){
                alert('Tu cuenta está bloqueada, por favor comunicate con blabla')
            } else if (usuario.dni === datos.dni && usuario.password === datos.password){ 
                localStorage.setItem('user', JSON.stringify(usuario))
                navigate(routes.userPrincipal)
            }else if(usuario.password !== datos.password){
                setIntento(intento+1)
                if (intento == 3){
                    //fetch para bloquear cuenta
                    alert('Contraseña incorrecta, tu cuenta fue bloqueada comunicate con blabla')
                }else{
                    alert('El DNI o la contraseña son incorrectas')
                }
            }
        } */
    }



    return(
        <main className="main">
                <h1>Iniciar Sesion</h1>
                <div className="labels">

                    <p>Si no tenes una cuenta podes registrarte <Link to={routes.crearCuenta} style={{textDecoration:'none'}}><span>acá</span></Link></p>

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

                    <button type="button" className="iniciar" onClick={handleIniciar}>Iniciar sesión</button>
                </div>
        </main>
    )
}

export default IniciarSesion
