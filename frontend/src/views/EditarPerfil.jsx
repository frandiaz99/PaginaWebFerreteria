import React, { useState, useEffect } from "react";
import "../styles/EditarPerfil.css";
import Modal from "../components/Modal";
import { Link, Navigate } from "react-router-dom";
import routes from "../routes";
import { useNavigate } from "react-router-dom";

function EditarPerfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState();
    const user = JSON.parse(localStorage.getItem("user"));

    const [datos, setDatos] = useState({ nombre: '', apellido: '' });

    const [imagen, setImagen] = useState({ foto: "" })

    const [confirmacion, setConfirmacion] = useState(false);

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        })
    }

    const handleGuardarCambios = () => {

        const usuarioModificado = {
            ...usuario,
            nombre: datos.nombre !== '' ? datos.nombre : usuario.nombre,
            apellido: datos.apellido !== '' ? datos.apellido : usuario.apellido
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
                console.log("Respuesta del servidor al editar perfil:", data);
                setConfirmacion(true);

                localStorage.setItem("user", JSON.stringify(usuarioModificado));
                console.log("usuario modificado: ", usuarioModificado);
                navigate(routes.perfil);
            })
            .catch((error) => {
                console.error("Hubo un problema al guardar los cambios:", error);
                // Manejo de errores
            });
    };

    const handleYes = () => {
        handleGuardarCambios(); //guardaria el nombre, sucursal, foto lo que sea
        setConfirmacion(false);
        navigate(routes.perfil);
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
                console.log(data);
                setUsuario(data.User);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    return (
        <main className='main'>
            <form className='contenedor-editar-perfil' onSubmit={handleGuardarCambios} encType="multipart/form-data">
                <div className='cambios-perfil' >
                    <div className='foto-perfil' style={{ backgroundImage: `url(http://localhost:5000/img/${user.foto_perfil})` }}>
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
                        <div className='nombre'>Nombre: <input name='nombre' type='text' defaultValue={user.nombre} onChange={handleChange} /></div>
                        <div className='apellido'>Apellido: <input name='apellido' type='text' defaultValue={user.apellido} onChange={handleChange} /></div>
                        <div className='sucursal'>
                            Sucursal:
                            <select defaultValue={user.sucursal}>
                                <option value="La plata">La plata</option>
                                <option value="Cordoba">Cordoba</option>
                                <option value="Santa Fe">Santa Fe</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='botones'>
                    <div className='cambiar-contrasena'>
                        <Link to={routes.cambiarContrasenia} ><button>Cambiar contraseña</button></Link>
                    </div>
                    <div className='guardar'>
                        <button onClick={handleGuardarCambios} type='submit'>Guardar cambios</button>
                        <Modal texto={'Los cambios se han guardado con exito. '}
                            confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={true} />
                        <Link to={routes.perfil} className='link'><button>Cancelar</button></Link>

                    </div>
                </div>
            </form>
        </main >
    )

}

export default EditarPerfil;
