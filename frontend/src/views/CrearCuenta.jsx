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
        console.log("Falta chekear que la imagen este eleegida tambien. O no depende, por default va a tenrer una");
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

    const handleRegistro= async () =>{    //fetch para crear usuario en BD
        
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
                       credentials: "include"
                    });
                    
                    console.log({"response": response})
                    alert(" response");
                    if (!response.ok) {
                        alert(" response no ok");
                        throw new Error('Network response was not ok');
                    }
                    
                    alert(" response OK");
                    const data = await response.json();
                    console.log("Registro exitoso:", data);
                    // Do something after successful registration
                    alert(" response OK sale");
                    
                } catch (error) {
                    console.error("Error in registration:", error);
                    console.error("Si ingresate bien lso datos se va a haber registrado el ussuario, pero no logro que devuevla bien");
                    alert(" response registration");
                    // Handle network errors or other unexpected issues
                }
                

            } else {
                
                console.log({"Coinciden ":coincidenContrasenias,"esMayor": esMayor,"cumpleCOntra": cumpleContrasenia,"DniValido": dniValido,"todo": todosLosCamposCompletos(datos)});
                alert(" ELSE");
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

            <div className="forms" encType="multipart/form-data">
                <form onSubmit={handleRegistro}>

                <div className="form1">
                    <label htmlFor="nombre">Nombre</label>
                    <input name="nombre" type="text" placeholder="Ingresá tu nombre" onChange={handleChange}/>

                    <label htmlFor="apellido">Apellido</label>
                    <input name="apellido" type="text" placeholder="Ingresá tu apellido" onChange={handleChange}/>

                    <label htmlFor="email">Email</label>
                    <input name="email" type="text" placeholder="Ingresá tu email" onChange={handleChange}/>

                    <label htmlFor="contrasenia">Contraseña</label>
                    <input name="password" type="text" placeholder="Crea una contraseña" onChange={handleChange}/>

                    <p className="textoBajoLabelRegistro">
                        Ingresa una combinación de más de 6 caracteres, con al menos un caracter especial y una mayúscula.
                    </p>
                    {!cumpleContrasenia && <p style={{color:'red'}}>La contraseña no cumple las condiciones</p>}

                    <label htmlFor="repetirContrasenia">Repetir contraseña</label>
                    <input name="repetirContrasenia" type="text" placeholder="Repetí la contraseña" onChange={handleChange}/>  
                    {!coincidenContrasenias && <p className="textoNoCumple">Las contraseñas no coinciden</p>}       

                </div>
                <div className="form2">
                    <div className="form2__labels">
                        <label htmlFor="dni">DNI</label>
                        <input name="dni" type="number" placeholder="Ingresá tu DNI" onChange={handleChange}/>  
                        {!dniValido && <p className="textoNoCumple">DNI inválido</p>}

                        <label htmlFor="nacimiento">Nacimiento</label>
                        <input name="nacimiento" type="date" onChange={handleChange}/>  
                        {!esMayor && <p className="textoNoCumple">Debes ser mayor de edad</p>}

                        <label htmlFor="sucursal">Sucursal</label> {/*Hay que cargar esto con las sucursales desde el back*/}
                        <select name="sucursal" id="sucursal" onChange={handleChange}>
                            <option value="s1">Sucursal 1</option>
                            <option value="s2">Sucursal 2</option>
                            <option value="s3">Sucursal 3</option>
                        </select> 

                        {/* <input type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={handleFoto} /> */}
                        <input type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={e => {
                            console.log ({"name": e.target.name})
                            console.log ( e.target.files[0])
                            setImagen({[e.target.name]: e.target.files[0]})
                            console.log ( imagen);
                        }} />

                        <div className="suscripcion">
                            <input type="checkbox" id="checkbox" name="suscripto" onChange={handleCheckbox}/>
                            <label htmlFor="checkbox">Acepto recibir por email promociones, novedades y descuentos de la ferretería</label>
                        </div>

                    </div>
                        
                    

                </div>
                <input type="submit" className="registrarse" content="Registrarse"/>

                </form>
            </div>
        </main>
    )
}

export default CrearCuenta