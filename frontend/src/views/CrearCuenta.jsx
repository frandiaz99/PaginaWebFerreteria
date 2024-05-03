import { useState , useEffect} from "react";
import '../styles/CrearCuenta.css'
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal";

const verificarCondicionContrasenia= (contrasenia) =>{
    if (contrasenia === ''){
        return null
    }
    const tieneMinimoCaracteres = contrasenia.length >= 6;
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(contrasenia);
    const tieneMayuscula = /[A-Z]+/.test(contrasenia);

    return tieneMinimoCaracteres && tieneCaracterEspecial && tieneMayuscula;
}

const verificarContrasenias = (contrasenia, repetirContrasenia) => {
    if (contrasenia === '' && repetirContrasenia === '') return null
    return contrasenia === repetirContrasenia;
}

const verificarEdad= (fechaNacimiento) =>{
    if (fechaNacimiento === ''){
        return null
    }
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
       console.log("Falta chekear que la imagen este eleegida tambien. O no depende, por default va a tenrer una");
        if (typeof valor === 'string') {
            return valor.replace(/\s/g, "") !== '';
        } else {
            return valor !== ''; 
        }
    });
} 

function CrearCuenta(){
    const {confirmacion, setConfirmacion}= useState(false)
    const navigate = useNavigate();
    const [cumpleContrasenia, setCumpleContrasenia]= useState(false)
    const [coincidenContrasenias,setCoincidenContrasenias]= useState(false)
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
        suscripto: false,
      })
    const [imagen, setImagen] = useState({foto:""});
      
    const handleChange = (e) => {
        //console.log(e);
        setDatos({
          ...datos,
          [e.target.name]: e.target.value,
        })
    };

    /*const handleFoto = (f) => {
        //console.log(f);
        //console.log(f.target.name);
        //console.log(f.target.files[0]);
        setDatos ({...datos, [f.target.name]: f.target.files[0]});
        console.log(datos.foto);
    }*/

    const handleCheckbox = (c) =>{
        setDatos({
            ...datos,
            [c.target.name]: c.target.checked
        });
    }

    const handleRegistro= async (event) =>{    //fetch para crear usuario en BD
        event.preventDefault(); //para evitar que se recargue la pagina
        console.log({"Coinciden ":coincidenContrasenias,"esMayor": esMayor,"cumpleContra": cumpleContrasenia,"DniValido": dniValido,"todo": todosLosCamposCompletos(datos)});
        console.log ({"datos": datos});
        console.log ({"imagen": imagen});
        //alert("Aguanta, entro");
        if (coincidenContrasenias && esMayor && cumpleContrasenia && dniValido && todosLosCamposCompletos(datos)){
            const formData = new FormData();
            formData.append("User", JSON.stringify(datos));
            formData.append("Imagen", imagen.foto);
            console.log({"form Data": formData});
                /*
                fetch("http://localhost:5000/user/register", {
                    method: "POST",
                    //headers: { "Content-Type": "multipart/form-data" },
                    //headers: { "Content-Type": "application/JSON" },
                    //body: JSON.stringify({ User: datos, file: formData  }),
                    body: formData,
                    credentials: "include"
                })
                .then( response => {
                    if (!response.ok) {
                        return response.json().then(data => { 
                            alert("RESPONSE");
                            
                            throw new Error(data.message || "Error en el registro");
                        });
                    }
                    alert(" SALE RESPONSE");
                    return response.json();
                })
                .then(data => {
                    alert(" ENTRA RESPONSE");
                    console.log("Registro exitoso:", data)
                    //Podría ir una pantalla de carga
                    //navigate(routes.iniciarSesion);
                    alert(" sale RESPONSE");
                })
                .catch(error => {
                    //console.error("Error en el registro:", error.message);
                    console.log(error);
                    console.error(error);
                    alert(" CATCH");
                    //Depende si no se pudo por dni repetido o por mail repetido informar
                });            
                */
               
               try {
                   const response = await fetch("http://localhost:5000/user/register", {
                       method: "POST",
                       body: formData,
                       //headers: { "Content-Type": "multipart/form-data" },
                       credentials: "include"
                    });
                    
                    console.log({"response": response})
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log("Registro exitoso:", data);
                    setConfirmacion(true)
                    
                } catch (error) {
                    console.error("Error in registration:", error);
                    console.error("Si ingresate bien lso datos se va a haber registrado el ussuario, pero no logro que devuevla bien");
                    alert(" response registration");
                    // Handle network errors or other unexpected issues
                }
                

        }
    }

    const handleOkRegistro = () =>{
        navigate(routes.iniciarSesion)
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
        if (datos.dni.length == 0) dniCumple=null
        else if (datos.dni.length == 8) dniCumple= true
        setDniValido(dniCumple);
    }, [datos.dni])

    return(
        
        <main className="main">

            <h2>Registrarse</h2>

            <div className="forms" >
                <form onSubmit={handleRegistro} className="formPrincipal" encType="multipart/form-data">

                    <div className="divInputRegistro">
                        <label htmlFor="nombre">Nombre</label>
                        <input name="nombre" type="text" placeholder="Ingresá tu nombre" onChange={handleChange}/>
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="apellido">Apellido</label>
                        <input name="apellido" type="text" placeholder="Ingresá tu apellido" onChange={handleChange}/>
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="email">Email</label>
                        <input name="email" type="email" placeholder="fedeteria@gmail.com" onChange={handleChange}/>
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="contrasenia">Contraseña</label>
                        <input name="password" type="password" placeholder="Crea una contraseña" onChange={handleChange}/>
                        <p className="textoBajoLabelRegistro">
                            Ingresa una combinación de más de 6 caracteres, con al menos un caracter especial y una mayúscula.
                        </p>
                        {(cumpleContrasenia== false) && <p className="textoNoCumple">La contraseña no cumple las condiciones</p>}
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="repetirContrasenia">Repetir contraseña</label>
                        <input name="repetirContrasenia" type="password" placeholder="Repetí la contraseña" onChange={handleChange}/>  
                        {(coincidenContrasenias == false) && <p className="textoNoCumple">Las contraseñas no coinciden</p>}       
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="dni">DNI</label>
                        <input name="dni" type="number" placeholder="Ingresá tu DNI" onChange={handleChange}/>  
                        {(dniValido == false) && <p className="textoNoCumple">DNI inválido</p>}
                    </div>

                    <div className="divInputRegistro">
                        <label htmlFor="nacimiento">Fecha de nacimiento</label>
                        <input name="nacimiento" type="date" onChange={handleChange}/>  
                        {(esMayor == false) && <p className="textoNoCumple">Debes ser mayor de edad</p>}
                    </div>
                    
                    <div className="divInputRegistro">
                        <label htmlFor="sucursal">Sucursal</label> {/*Hay que cargar esto con las sucursales desde el back*/}
                        <select name="sucursal" id="sucursal" onChange={handleChange}>
                            <option value="s1">Sucursal 1</option>
                            <option value="s2">Sucursal 2</option>
                            <option value="s3">Sucursal 3</option>
                        </select> 
                    </div>

                    <div className="divSubirFoto">
                        <label htmlFor="foto">Foto de perfil</label>
                        {/* <input type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={handleFoto} /> */}
                        <input type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={e => {
                            console.log ({"name": e.target.name})
                            console.log ( e.target.files[0])
                            setImagen({[e.target.name]: e.target.files[0]})
                            console.log ( imagen);
                        }} />
                    </div>

                    <div className="suscripcion">
                        <input type="checkbox" id="checkbox" name="suscripto" onChange={handleCheckbox}/>
                        <label htmlFor="checkbox" style={{fontSize:'12px'}}>Acepto recibir por email promociones, novedades y descuentos de la ferretería</label>
                    </div>
                            
                    <div className="divRegistrarse">
                        <input type="submit" className="registrarse" content="Registrarse" value={'Registrarse'}/>
                    </div>

                </form>
            </div>
            <Modal texto={'¡Registro exitoso!'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleOkRegistro}/>
        </main>
    )
}

export default CrearCuenta