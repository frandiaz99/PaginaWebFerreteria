import React, { useEffect, useState } from 'react';
import '../styles/crearPromocion.css';
import Modal from '../components/Modal';
import routes from '../routes';

function todosLosCamposCompletos(datos, imagen) {
    return (imagen !== '' && imagen !== undefined) && datos.texto !== '' && datos.fecha !== '' && datos.duracion !== '';
}

function CrearPromocion() {
    const [promocionRepetida, setPromocionRepetida] = useState(false);
    const [todoCompleto, setTodoCompleto] = useState(false);
    const [datos, setDatos] = useState({
        titulo: '',
        fecha: new Date(),
        duracion: ''
    });

    const [subirPromocion, setSubirPromocion] = useState(false);
    const [imagen, setImagen] = useState({ foto: '' });

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (todosLosCamposCompletos(datos, imagen.foto)) setTodoCompleto(true);
        else setTodoCompleto(false);
    }, [datos, imagen]);

    const handleSubirPromocion = (e) => {
        e.preventDefault();

        console.log("datos --> ", datos);

        const formData = new FormData();
        formData.append('Promocion', JSON.stringify(datos));
        formData.append('Imagen', imagen.foto);

        console.log("formData -->", formData);
        console.log("ta o no ta --> ", todoCompleto)
        if (todoCompleto) {
            console.log("aaaaaaaaaaaaaaaaaaaa")
            fetch('http://localhost:5000/promocion/crearPromocion', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((data) => {
                            throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                        });
                    }

                    return response.json();
                })
                .then((data) => {
                    console.log("creacion exitosa: ", data);
                    setSubirPromocion(true);
                })
                .catch((error) => {
                    const errorData = JSON.parse(error.message);
                    if (errorData.status === 400) {
                        setPromocionRepetida(true);
                    }
                    console.error('Error en la creación de la promoción:', errorData);
                });
        }
    };

    const handleOk = () => {
        setSubirPromocion(false);
        window.location.href = routes.promociones;
    };

    return (
        <main className='main'>
            <form className='formSubirPromocion' onSubmit={handleSubirPromocion} encType='multipart/form-data'>
                {!todoCompleto && (
                    <div className='divCampoObligatorio'>
                        <p className='campoObligatorio'>*Todos los campos son obligatorios</p>
                    </div>
                )}
                <div className='div-subirpromocion-inputs'>
                    <div className='div-subirpromocion-fila'>
                        <div className='div-subirPromocion'>
                            <label htmlFor='titulo'>Título de la promoción</label>
                            <input type='text' name='titulo' className='inputSubirPromocion' onChange={handleChange} />
                        </div>
                        <div className='div-subirPromocion'>
                            <label htmlFor='duracion'>Duración (días)</label>
                            <input type='number' name='duracion' className='inputSubirPromocion' onChange={handleChange} />
                        </div>
                        <div className='div-subirPromocion'>
                            <label htmlFor='foto'>Foto de la promoción</label>
                            <input
                                className='input-foto'
                                id='input-foto'
                                type='file'
                                accept='.png, .jpg, .jpeg'
                                name='foto'
                                onChange={(e) => {
                                    setImagen({ [e.target.name]: e.target.files[0] });
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className='div-botonSubirPromocion'>
                    <button type='submit' className='boton-subir-promocion'>
                        Subir promoción
                    </button>
                </div>
            </form>
            <Modal
                texto={'La promoción se ha creado con éxito.'}
                confirmacion={subirPromocion}
                setConfirmacion={setSubirPromocion}
                handleYes={handleOk}
                ok={true}
            />
            <Modal
                texto={'No se pudo efectivizar el registro de la promoción porque ya existe una promoción con ese título'}
                confirmacion={promocionRepetida}
                setConfirmacion={setPromocionRepetida}
                ok={true}
            />
        </main>
    );
}

export default CrearPromocion;
