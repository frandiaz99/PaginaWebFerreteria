import React, { useState, useEffect } from 'react'
import '../styles/EditarPerfil.css'
import Modal from '../components/Modal'
import { Link, Navigate } from 'react-router-dom';
import routes from '../routes';
import { useNavigate } from 'react-router-dom'


function EditarPerfil() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState();
    const user = JSON.parse(localStorage.getItem('user'));

    const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', apellido: '', sucursal: '' })


    const [confirmacion, setConfirmacion] = useState(false);

    const handleNombreChange = (event) => {
        setNuevoUsuario({
            ...nuevoUsuario,
            nombre: event.target.value
        })
    }

    const handleApellidoChange = (event) => {
        setNuevoUsuario({
            ...nuevoUsuario,
            apellido: event.target.value
        })
    }

    const handleSucursalChange = (event) => {
        setNuevoUsuario({
            ...nuevoUsuario,
            sucursal: event.target.value
        })
    }

    const handleGuardarCambios = () => {

        const usuarioModificado = {
            ...usuario,
            nombre: nuevoUsuario.nombre !== '' ? nuevoUsuario.nombre : usuario.nombre,
            apellido: nuevoUsuario.apellido !== '' ? nuevoUsuario.apellido : usuario.apellido,
            sucursal: nuevoUsuario.sucursal !== '' ? nuevoUsuario.sucursal : usuario.sucursal
        }

        fetch('http://localhost:5000/user/editarPerfil',

            {
                method: 'POST',
                //headers: {
                //    'Content-Type': 'application/json'
                //},
                body: JSON.stringify(usuarioModificado),
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema al guardar los cambios');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor al editar perfil:', data);
                setUsuario(usuarioModificado)
                setConfirmacion(true);

                localStorage.setItem('user', JSON.stringify(usuarioModificado))
                console.log("usuario modificado: ", usuarioModificado)
                navigate(routes.perfil);
            })
            .catch(error => {
                console.error('Hubo un problema al guardar los cambios:', error);
                // Manejo de errores
            });
    };

    const handleYes = () => {
        handleGuardarCambios(); //guardaria el nombre, sucursal, foto lo que sea 
        setConfirmacion(false);
        navigate(routes.perfil)
    }

    useEffect(() => {
        fetch('http://localhost:5000/user/getSelf',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/JSON",
                },
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema al obtener los articulos');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setUsuario(data.User)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])

    return (
        <main className='main'>
            <div className='contenedor-editar-perfil'>
                <div className='cambios-perfil'>
                    <div className='foto-perfil' style={{ backgroundImage: `url(http://localhost:5000/img/${user.foto_perfil})` }}>
                        <input type='file' id='input-foto' accept='image/*' />
                        <label htmlFor='input-foto' >Cambiar foto</label>
                    </div>

                    <div className='datos'>
                        <div className='nombre'>Nombre: <input type='text' defaultValue={user.nombre} onChange={handleNombreChange} /></div>
                        <div className='apellido'>Apellido: <input type='text' defaultValue={user.apellido} onChange={handleApellidoChange} /></div>
                        <div className='sucursal'>
                            Sucursal:
                            <select defaultValue={user.sucursal} onChange={handleSucursalChange}>
                                <option value="La plata">La plata</option>
                                <option value="Cordoba">Cordoba</option>
                                <option value="Santa Fe">Santa Fe</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='botones'>
                    <div className='cambiar-contrasena'>
                        <button>Cambiar contraseña</button>
                    </div>
                    <div className='guardar'>
                        <button onClick={handleGuardarCambios} >Guardar cambios</button>
                        <Modal texto={'Los cambios se han guardado con exito. '}
                            confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={true} />
                        <Link to={routes.perfil} className='link'><button>Cancelar</button></Link>

                    </div>
                </div>
            </div>
        </main >
    )

}

export default EditarPerfil