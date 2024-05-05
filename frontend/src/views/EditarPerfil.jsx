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

    const [confirmacion, setConfirmacion] = useState(false);

    //datos del usuario
    const [imagen, setImagen] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [sucursal, setSucursal] = useState('');

    const handleGuardarCambios = () => {
        setConfirmacion(true);
    }

    const handleYes = () => {
        handleGuardarCambios(); //guardaria el nombre, sucursal, foto lo que sea 
        setConfirmacion(false);
        navigate(routes.perfil)
    }

    const handleImagenChange = (event) => {
        // Aquí puedes manejar el cambio de la imagen de perfil
        setImagen(event.target.files[0]); // Guardar el archivo de imagen en el estado
    };

    const handleNombreChange = (event) => {
        // Aquí puedes manejar el cambio del nombre
        setNombre(event.target.value);

    };

    const handleApellidoChange = (event) => {
        // Aquí puedes manejar el cambio del apellido
        setApellido(event.target.value);
    };

    const handleSucursalChange = (event) => {
        // Aquí puedes manejar el cambio de la sucursal
        setSucursal(event.target.value);
    };

    const handleSubmit = (event) => {
        // Aquí puedes enviar los datos del formulario al servidor
        event.preventDefault();
        // Código para enviar los datos del perfil al servidor
    };

    useEffect(() => {
        fetch('http://localhost:5000/user/getSelf',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/JSON",
                }, credentials: "include"
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
                        <input type='file' id='input-foto' accept='image/*' onChange={handleImagenChange} />
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