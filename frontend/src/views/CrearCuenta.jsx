import { useState, useEffect } from "react";
import '../styles/CrearCuenta.css'
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal";
import routes from "../routes";

const soyAdmin = () => {
    return location.pathname === '/admin/registrar_empleado'
}
const verificarCondicionContrasenia = (contrasenia) => {
    if (contrasenia === '') {
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

const verificarEdad = (fechaNacimiento) => {
    if (fechaNacimiento === '') {
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

const todosLosCamposCompletos = (datos) => {
    if (soyAdmin()) return true
    return Object.values(datos).every(valor => {
        if (typeof valor === 'string') {
            return valor.replace(/\s/g, "") !== '';
        } else {
            return valor !== '';
        }
    });
}

function CrearCuenta() {
    const [confirmacion, setConfirmacion] = useState(false)
    const [dniRepetido, setDniRepetido] = useState(false)
    const [emailRepetido, setEmailRepetido] = useState(false)
    const [emailYDNIRepetidos, setEmailYDNIRepetidos] = useState(false)
    const [faltanCampos, setFaltanCampos] = useState(false)
    const navigate = useNavigate();
    const [cumpleContrasenia, setCumpleContrasenia] = useState(false)
    const [coincidenContrasenias, setCoincidenContrasenias] = useState(false)
    const [dniValido, setDniValido] = useState(false)
    const [esMayor, setEsMayor] = useState(false)
    const [dniEmple, setDniEmple] = useState(null)
    const [datos, setDatos] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        repetirContrasenia: '',
        dni: '',
        nacimiento: '',
        sucursal: '',
        suscripto: false,
    })
    const [sucursales, setSucursales] = useState([]);

    useEffect(() => {
        if (soyAdmin()) { //Es la unica forma, no pude insertar el dni en el estado datos.
            setDniEmple(JSON.parse(localStorage.getItem('dniEmple')))
            setDniValido(true)
        }
    }, [])
    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        })
    };

    const changeSucursal = (e) => {
        const sucursalElegida = sucursales.find(s => s._id === e.target.value)
        setDatos({
            ...datos,
            sucursal: sucursalElegida,
        })
    }

    /*const handleFoto = (f) => {
        //console.log(f);
        //console.log(f.target.name);
        //console.log(f.target.files[0]);
        setDatos ({...datos, [f.target.name]: f.target.files[0]});
        console.log(datos.foto);
    }*/

    const handleCheckbox = (c) => {
        setDatos({
            ...datos,
            [c.target.name]: c.target.checked
        });
    }

    const handleRegistro = async (event) => {    //fetch para crear usuario en BD
        event.preventDefault(); //para evitar que se recargue la pagina
        if (coincidenContrasenias && esMayor && cumpleContrasenia && dniValido && todosLosCamposCompletos(datos)) {
            if (soyAdmin()) {
                fetch("http://localhost:5000/user/registrarEmpleado", {
                    method: "POST",
                    headers: { "Content-Type": "application/JSON" },
                    body: JSON.stringify({ User: { nombre: datos.nombre, apellido: datos.apellido, email: datos.email, password: datos.password, dni: dniEmple, nacimiento: datos.nacimiento, sucursal: datos.sucursal, suscripto: datos.suscripto } }),
                    credentials: "include"
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                console.log(data)
                                throw new Error(data.error_values);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        setConfirmacion(true)
                    })
                    .catch(error => {
                        if (error == 'Error: dni,email') setEmailYDNIRepetidos(true)
                        else if (error == 'Error: email') setEmailRepetido(true)
                        else if (error == 'Error: dni') setDniRepetido(true)
                    })
            }
            else {
                fetch("http://localhost:5000/user/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/JSON" },
                    body: JSON.stringify({ User: datos }),
                    credentials: "include"
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                console.log(data)
                                throw new Error(data.error_values);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        setConfirmacion(true)
                    })
                    .catch(error => {
                        if (error == 'Error: dni,email') setEmailYDNIRepetidos(true)
                        else if (error == 'Error: email') setEmailRepetido(true)
                        else if (error == 'Error: dni') setDniRepetido(true)
                    })
            }
        } else {
            setFaltanCampos(true)
        }
    }

    const handleOkRegistro = () => {
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
        if (!soyAdmin()) {
            let dniCumple = false
            if (datos.dni.length == 0) dniCumple = null
            else if (datos.dni.length == 8) dniCumple = true
            setDniValido(dniCumple);
        }
    }, [datos.dni])


    useEffect(() => {  //obtener sucursales
        fetch("http://localhost:5000/sucursal/getSucursales", {
            method: "GET",
            headers: { "Content-Type": "application/JSON" },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema al obtener las sucursales');
                }
                return response.json();
            })
            .then(data => {
                setDatos({
                    ...datos,
                    sucursal: data.Sucursales[0]
                })
                setSucursales(data.Sucursales)
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }, [])


    return (

        <main className="main">

            <div className="forms">
                {soyAdmin() && <h2 style={{ marginTop: '20px' }}>Registrar Empleado</h2>}
                {!soyAdmin() && <h2 style={{ marginTop: '20px' }}>Registrarse</h2>}

                <form onSubmit={handleRegistro} className="formPrincipal" encType="multipart/form-data">
                    <div className="nombre-apellido contenedor-registro">
                        <div className="divInputRegistro">
                            <label htmlFor="nombre">Nombre</label>
                            {soyAdmin() ?
                                <input name="nombre" type="text" placeholder="Ingresá nombre del empleado" onChange={handleChange} />
                                :
                                <input name="nombre" type="text" placeholder="Ingresá tu nombre" onChange={handleChange} />}
                        </div>

                        <div className="divInputRegistro">
                            <label htmlFor="apellido">Apellido</label>
                            {soyAdmin() ?
                                <input name="apellido" type="text" placeholder="Ingresá apellido del empleado" onChange={handleChange} />
                                :
                                <input name="apellido" type="text" placeholder="Ingresá tu apellido" onChange={handleChange} />}
                        </div>
                    </div>

                    <div className="mail-dni contenedor-registro">
                        {!soyAdmin() && <div className="divInputRegistro">
                            <label htmlFor="dni">DNI</label>
                            <input name="dni" type="number" min={0} placeholder="Ingresá tu DNI" onChange={handleChange} />
                            {(dniValido == false) && <p className="textoNoCumple">DNI inválido</p>}
                        </div>}
                        <div className="divInputRegistro">
                            <label htmlFor="email">Email</label>
                            <input name="email" type="email" placeholder="fedeteria@gmail.com" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="div-contrasenia contenedor-registro">
                        <div className="divInputRegistro">
                            <label htmlFor="contrasenia">Contraseña</label>
                            <input name="password" type="password" placeholder="Crea una contraseña" onChange={handleChange} />

                            {(cumpleContrasenia == false) && <p className="textoNoCumple">La contraseña no cumple las condiciones</p>}
                        </div>

                        <div className="divInputRegistro">
                            <label htmlFor="repetirContrasenia">Repetir contraseña</label>
                            <input name="repetirContrasenia" type="password" placeholder="Repetí la contraseña" onChange={handleChange} />
                            {(coincidenContrasenias == false) && <p className="textoNoCumple">Las contraseñas no coinciden</p>}
                        </div>
                    </div>
                    <div className="texto-registro">
                        <p className="textoBajoLabelRegistro">
                            Ingresa una combinación de más de 6 caracteres, con al menos un caracter especial y una mayúscula
                        </p>
                    </div>

                    <div className="nacimiento-sucursal contenedor-registro">
                        <div className="divInputRegistro div-nacimiento">
                            <label htmlFor="nacimiento">Fecha de nacimiento</label>
                            <input name="nacimiento" type="date" onChange={handleChange} />
                            {soyAdmin() ?
                                (esMayor == false) && <p className="textoNoCumple">El empleado debe ser mayor de edad</p>
                                :
                                (esMayor == false) && <p className="textoNoCumple">Debes ser mayor de edad</p>}
                        </div>

                        <div className="divInputRegistro div-sucursal">
                            <label htmlFor="sucursal">Sucursal</label> {/*Hay que cargar esto con las sucursales desde el back*/}
                            <select name="sucursal" id="sucursal" onChange={changeSucursal}>
                                {sucursales.map((s, index) => (<option key={index} value={s._id}>{s.nombre}</option>))}
                            </select>
                        </div>


                    </div>
                    {/*<div className="divSubirFoto">
                        <label htmlFor="foto">Foto de perfil</label>
                        {/* <input type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={handleFoto} /> *
                        <input id="fotoRegistro" type="file" accept=".png, .jpg, .jpeg" name="foto" onChange={e => {
                            console.log ({"name": e.target.name})
                            console.log ( e.target.files[0])
                            setImagen({[e.target.name]: e.target.files[0]})
                            console.log ( imagen);
                        }} />
                    </div>*/}

                    <div className="suscripcion">
                        <input type="checkbox" id="checkbox" name="suscripto" onChange={handleCheckbox} />
                        <label htmlFor="checkbox" style={{ fontSize: '12px' }}>Acepto recibir por email promociones, novedades y descuentos de la ferretería.</label>
                    </div>

                    <div className="divRegistrarse">
                        {soyAdmin() ?
                            <input type="submit" className="registrarse" content="Registrarse" value={'Registrar empleado'} />
                            :
                            <input type="submit" className="registrarse" content="Registrarse" value={'Registrarse'} />}
                    </div>

                </form>
            </div>
            <Modal texto={'Registro exitoso'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleOkRegistro} ok={true} />
            <Modal texto={'El DNI ya está registrado'} confirmacion={dniRepetido} setConfirmacion={setDniRepetido} ok={true} />
            <Modal texto={'El email ya está registrado'} confirmacion={emailRepetido} setConfirmacion={setEmailRepetido} ok={true} />
            <Modal texto={'El email y el DNI ya están registrados'} confirmacion={emailYDNIRepetidos} setConfirmacion={setEmailYDNIRepetidos} ok={true} />
            <Modal texto={'Faltan completar campos'} confirmacion={faltanCampos} setConfirmacion={setFaltanCampos} ok={true} />
        </main>
    )
}

export default CrearCuenta