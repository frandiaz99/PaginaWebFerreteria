import React, { useState, useEffect } from "react";
import "../styles/EditarPerfil.css";
import Modal from "../components/Modal";
import { Link, Navigate } from "react-router-dom";
import routes from "../routes";
import { useNavigate } from "react-router-dom";

function EditarPerfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({});
    //const user = JSON.parse(localStorage.getItem("user"));

    const [datos, setDatos] = useState({ nombre: '', apellido: '', sucursal: '' });

    const [imagen, setImagen] = useState({ foto: "" })

    const [sucursales, setSucursales] = useState([]);

    const [editarPerfil, setEditarPerfil] = useState(false);

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        })
    }

    const changeSucursal = (e) => {
        const sucursalElegida = sucursales.find(s => s._id === e.target.value)
        setDatos({
            ...datos,
            sucursal: sucursalElegida,
        })
    }

    const handleGuardarCambios = (event) => {

        event.preventDefault();
        const usuarioModificado = {
            ...usuario,
            nombre: datos.nombre !== '' ? datos.nombre : usuario.nombre,
            apellido: datos.apellido !== '' ? datos.apellido : usuario.apellido,
            sucursal: datos.sucursal !== '' ? datos.sucursal : usuario.sucursal
        };

        const formData = new FormData();
        formData.append("User", JSON.stringify(usuarioModificado));
        formData.append("Imagen", imagen.foto)
        console.log({ "form Data": formData });

        fetch(
            "http://localhost:5000/user/editarPerfil",

            {
                method: "POST",
                body: formData,
                credentials: "include",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hubo un problema al guardar los cambios");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Perfil editado:", data);
                setEditarPerfil(true);

                //localStorage.setItem("user", JSON.stringify(usuarioModificado));
                //console.log("usuario modificado: ", usuarioModificado);

                //localStorage.setItem("user", JSON.stringify(usuarioModificado));
                console.log("foto_perfil", imagen.foto)
            })
            .catch((error) => {
                console.error("Hubo un problema al guardar los cambios:", error);
                // Manejo de errores
            });
    };

    const handleOk = () => {
        setEditarPerfil(false);
        window.location.reload();
    };

    useEffect(() => {
        fetch("http://localhost:5000/user/getSelf", {
            method: "GET",
            headers: {
                "Content-Type": "application/JSON",
            },
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hubo un problema al obtener los articulos");
                }
                return response.json();
            })
            .then((data) => {
                console.log("usuario a editar: ", data);
                setUsuario(data.User);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

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
                setSucursales(data.Sucursales)
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }, []);



    return (
        <main className='main'>
            <form className='contenedor-editar-perfil' onSubmit={handleGuardarCambios} encType="multipart/form-data">
                <div className='cambios-perfil' >
                    <div className='foto-perfil' style={{ backgroundImage: `url(${imagen.foto ? URL.createObjectURL(imagen.foto) : `http://localhost:5000/img/${usuario.foto_perfil}`})` }}>
                        <input type='file' id='input-foto' accept=".png, .jpg, .jpeg" name='foto'
                            onChange={e => {
                                console.log({ "name": e.target.name })
                                console.log(e.target.files[0])
                                setImagen({ [e.target.name]: e.target.files[0] })
                                console.log(imagen);
                            }} />
                        <label htmlFor='input-foto' >Cambiar foto</label>
                    </div>

                    <div className='datos'>
                        <div className='nombre'>Nombre: <input name='nombre' type='text' defaultValue={usuario.nombre} onChange={handleChange} /></div>
                        <div className='apellido'>Apellido: <input name='apellido' type='text' defaultValue={usuario.apellido} onChange={handleChange} /></div>
                        <div className='sucursal-editar-perfil'>
                            Sucursal:
                            <select name="sucursal" id="sucursal" onChange={changeSucursal}>
                                {sucursales.map((s, index) => (<option key={index} value={s._id}>{s.nombre}</option>))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='botones'>
                    <div className='cambiar-contrasena'>
                        <Link to={routes.cambiarContrasenia} ><button>Cambiar contraseña</button></Link>
                    </div>
                    <div className='guardar'>
                        <button type='submit'>Guardar cambios</button>
                        <Link to={routes.perfil} className='link'><button>Cancelar</button></Link>
                    </div>
                </div>
            </form>
            <Modal texto={'Los cambios se han guardado con exito. '}
                confirmacion={editarPerfil} setConfirmacion={setEditarPerfil} handleYes={handleOk} ok={true} />
        </main >
    )

}

export default EditarPerfil;
