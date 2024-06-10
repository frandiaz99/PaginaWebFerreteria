// src/components/SubirPromocion.jsx
import React, { useEffect, useState } from 'react';
import '../styles/SubirPromocion.css';
import Modal from '../components/Modal';
import routes from '../routes';


function CrearPromocion() {
    const [promocionRepetida, setPromocionRepetida] = useState(false);
    const [todoCompleto, setTodoCompleto] = useState(false);
    const [datos, setDatos] = useState({
        titulo: '',
        descripcion: ''
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
    }, [datos]);

    useEffect(() => {
        if (todosLosCamposCompletos(datos, imagen.foto)) setTodoCompleto(true);
        else setTodoCompleto(false);
    }, [imagen]);

    const handleSubirPromocion = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Promocion', JSON.stringify(datos));
        formData.append('Imagen', imagen.foto);

        if (todoCompleto) {
            fetch('http://localhost:5000/promocion/newPromocion', {
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
                    setSubirPromocion(true);
                })
                .catch((error) => {
                    const errorData = JSON.parse(error.message);
                    if (errorData.status == 400) {
                        setPromocionRepetida(true);
                    }
                    console.error('Error en la creación de la promoción:', errorData);
                });
        }
    };

    const handleOk = () => {
        setSubirPromocion(false);
        window.location.href = routes.adminPromociones;
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
                            <label htmlFor='descripcion'>Descripción de la promoción</label>
                            <input type='text' name='descripcion' className='inputSubirPromocion' onChange={handleChange} />
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
