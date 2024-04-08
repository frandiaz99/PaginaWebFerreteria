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
    const [cumpleContrasenia, setCumpleContrasenia]= useState(false)
    const [coincidenContrasenias,setCoincidenContrasenias]= useState(null)
    const [esMayor,setEsMayor]= useState(false)
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contrasenia: '',
        repetirContrasenia:'',
        dni:'',
        nacimiento:'',
        sucursal:'s1',
        suscripcion: false
      });
      const navigate = useNavigate();

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
        if (coincidenContrasenias && esMayor && cumpleContrasenia && todosLosCamposCompletos(datos)){
            console.log(datos)
            navigate(routes.iniciarSesion)
        }else{
            alert('Datos erroneos')
        }
    }

    useEffect(() =>{  //Verificar que la contraseña cumpla las condiciones 
        const cumple= verificarCondicionContrasenia(datos.contrasenia)
        setCumpleContrasenia(cumple)
    }, [datos.contrasenia])

    useEffect(() => {  //Verificar que coincidan las contraseñas
        const coinciden = verificarContrasenias(datos.contrasenia, datos.repetirContrasenia);
        setCoincidenContrasenias(coinciden);
    }, [datos.contrasenia, datos.repetirContrasenia])

    useEffect(() => {  //Verificar que sea mayor de edad
        const mayor = verificarEdad(datos.nacimiento);
        setEsMayor(mayor);
    }, [datos.nacimiento])

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
                            id="contrasenia"
                            name="contrasenia"
                            type="text"
                            placeholder="Crea una contraseña"
                            onChange={handleChange}
                        />
                        <p className="condicionContrasenia">
                            Ingresa una combinación de más de 6 caracteres, con al menos un caracter especial y una mayúscula.
                        </p>
                        {cumpleContrasenia== false && <p>La contraseña no cumple las condiciones</p>}

                        <label htmlFor="repetirContrasenia">Repetir contraseña</label>
                        <input
                            id="repetirContrasenia"
                            name="repetirContrasenia"
                            type="text"
                            placeholder="Repetí la contraseña"
                            onChange={handleChange}
                        />  
                        {coincidenContrasenias== false && <p>Las contraseñas no coinciden</p>}                                                                    
                    </div>
                    <div className="form2">
                        <div className="form2__labels">
                            <label htmlFor="dni">DNI</label>
                            <input
                                id="dni"
                                name="dni"
                                type="text"
                                placeholder="Ingresá tu DNI"
                                onChange={handleChange}
                            />  
                            <label htmlFor="nacimiento">Nacimiento</label>
                            <input
                                id="nacimiento"
                                name="nacimiento"
                                type="date"
                                onChange={handleChange}
                            />  
                            {esMayor == false && <p>Debes ser mayor de edad</p>}

                            <label htmlFor="sucursal">Sucursal</label> {/*Hay que cargar esto con las sucursales desde el back*/}
                            <select name="sucursal" id="sucursal" onChange={handleChange}>
                                <option value="s1">Sucursal 1</option>
                                <option value="s2">Sucursal 2</option>
                                <option value="s3">Sucursal 3</option>
                            </select> 
                            <div className="suscripcion">
                                <input type="checkbox" id="checkbox" name="suscripcion" onChange={handleCheckbox}/>
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