import { useState , useEffect} from "react";
import '../styles/CrearCuenta.css'
import { useNavigate } from "react-router-dom"
import routes from "../routes";

const verificarCondicionContrasenia= (contrasenia) =>{
    if (contrasenia === ''){  //para que no aparezca el aviso la primera vez
        return null
    }
    const tieneMinimoCaracteres = contrasenia.length >= 6;
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(contrasenia);
    const tieneMayuscula = /[A-Z]+/.test(contrasenia);

    return tieneMinimoCaracteres && tieneCaracterEspecial && tieneMayuscula;
}

const verificarContrasenias = (contrasenia, repetirContrasenia) => {
    return contrasenia === repetirContrasenia;
}

const verificarEdad= (fechaNacimiento) =>{
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const hoy = new Date();
    fechaNacimientoObj.setDate(fechaNacimientoObj.getDate() + 1); //lo que me costo darme cuenta que me restaba un dia dios mio
    
    let edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoObj.getMonth();
    const dia = hoy.getDate() - fechaNacimientoObj.getDate();
    if (mes < 0 || (mes === 0 && dia < 0)) {
        edad--;
      }
  
    return edad >= 18;
}

const todosLosCamposCompletos= (datos) =>{
    return Object.values(datos).every(valor => {
        if (typeof valor === 'string') {
            return valor.replace(/\s/g, "") !== '';
        } else {
            return valor !== ''; 
        }
    });
} 

function CrearCuenta(){
    const navigate = useNavigate();
    const [cumpleContrasenia, setCumpleContrasenia]= useState(false)
    const [coincidenContrasenias,setCoincidenContrasenias]= useState(null)
    const [dniValido, setDniValido]= useState(false)
    const [esMayor,setEsMayor]= useState(false)
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        repetirContrasenia:'',
        dni:'',
        nacimiento:'',
        sucursal:'s1',
        suscripto: false
      });
      
    const handleChange = (e) => {
        setDatos({
          ...datos,
          [e.target.name]: e.target.value,
        })
    };

    const handleCheckbox = (c) =>{
        setDatos({
            ...datos,
            [c.target.name]: c.target.checked
        })
    }

    const handleRegistro= () =>{    //fetch para crear usuario en BD
        if (coincidenContrasenias && esMayor && cumpleContrasenia && dniValido && todosLosCamposCompletos(datos)){
            fetch("http://localhost:5000/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ User: datos }),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Error en el registro");
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Registro exitoso:", data)
                //Podría ir una pantalla de carga
                navigate(routes.iniciarSesion);
            })
            .catch(error => {
                console.error("Error en el registro:", error.message);
                //Depende si no se pudo por dni repetido o por mail repetido informar
                alert('No se pudo realizar el registro');
            });            
        }
    }

    useEffect(() => {  //Verificar que coincidan las contraseñas y que cumpla los requisitos de contraseña   
        setCoincidenContrasenias(verificarContrasenias(datos.password, datos.repetirContrasenia))
        setCumpleContrasenia(verificarCondicionContrasenia(datos.password))
    }, [datos.password, datos.repetirContrasenia])

    useEffect(() => {  //Verificar que sea mayor de edad
        setEsMayor(verificarEdad(datos.nacimiento));
    }, [datos.nacimiento])

    useEffect(() => {  //Verificar DNI valido
        let dniCumple= false
        if (datos.dni.length == 8){
            dniCumple= true;
        }
        setDniValido(dniCumple);
    }, [datos.dni])

    return(
        
        <main className="main">

            <h1>Registrarse</h1>

            <div className="forms">
                <div className="form1">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Ingresá tu nombre"
                        onChange={handleChange}
                    />
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        placeholder="Ingresá tu apellido"
                        onChange={handleChange}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Ingresá tu email"
                        onChange={handleChange}
                    />
                    <label htmlFor="contrasenia">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="text"
                        placeholder="Crea una contraseña"
                        onChange={handleChange}
                    />
                    <p className="textoBajoLabelRegistro">
                        Ingresa una combinación de más de 6 caracteres, con al menos un caracter especial y una mayúscula.
                    </p>
                    {!cumpleContrasenia && <p style={{color:'red'}}>La contraseña no cumple las condiciones</p>}

                    <label htmlFor="repetirContrasenia">Repetir contraseña</label>
                    <input
                        id="repetirContrasenia"
                        name="repetirContrasenia"
                        type="text"
                        placeholder="Repetí la contraseña"
                        onChange={handleChange}
                    />  
                    {!coincidenContrasenias && <p className="textoNoCumple">Las contraseñas no coinciden</p>}                                                                    
                </div>
                <div className="form2">
                    <div className="form2__labels">
                        <label htmlFor="dni">DNI</label>
                        <input
                            id="dni"
                            name="dni"
                            type="number"
                            placeholder="Ingresá tu DNI"
                            onChange={handleChange}
                        />  
                        {!dniValido && <p className="textoNoCumple">DNI inválido</p>}

                        <label htmlFor="nacimiento">Nacimiento</label>
                        <input
                            id="nacimiento"
                            name="nacimiento"
                            type="date"
                            onChange={handleChange}
                        />  
                        {!esMayor && <p className="textoNoCumple">Debes ser mayor de edad</p>}

                        <label htmlFor="sucursal">Sucursal</label> {/*Hay que cargar esto con las sucursales desde el back*/}
                        <select name="sucursal" id="sucursal" onChange={handleChange}>
                            <option value="s1">Sucursal 1</option>
                            <option value="s2">Sucursal 2</option>
                            <option value="s3">Sucursal 3</option>
                        </select> 
                        <div className="suscripcion">
                            <input type="checkbox" id="checkbox" name="suscripto" onChange={handleCheckbox}/>
                            <label htmlFor="checkbox">Acepto recibir por email promociones, novedades y descuentos de la ferretería</label>
                        </div>
                    </div>
                        
                    <button type="button" onClick={handleRegistro} className="registrarse">Registrarse</button>
                </div>
            </div>
        </main>
    )
}

export default CrearCuenta