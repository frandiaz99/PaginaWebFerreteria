import React, { useEffect, useState } from 'react'
import '../styles/SubirSucursal.css'
import Modal from "../components/Modal";
import routes from "../routes";

function todosLosCamposCompletos(datos, imagen) {
  console.log("datos", imagen)
  return (imagen !== '' && imagen !== undefined) && datos.nombre !== '' && datos.provincia !== '' && datos.ciudad !== '' && datos.direccion !== '' && datos.telefono !== ''
}

function SubirSucursal() {
  const [sucursalRepetida, setSucursalRepetida] = useState(false)
  const [todoCompleto, setTodoCompleto] = useState(false)
  const [datos, setDatos] = useState({
    nombre: '',
    provincia: '',
    ciudad: '',
    direccion: '',
    telefono: ''
  })

  const [subirSucursal, setSubirSucursal] = useState(false)
  const [imagen, setImagen] = useState({ foto: "" })

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    if (todosLosCamposCompletos(datos, imagen.foto)) setTodoCompleto(true)
    else setTodoCompleto(false)
  }, [datos])

  useEffect(() => {
    if (todosLosCamposCompletos(datos, imagen.foto)) setTodoCompleto(true)
    else setTodoCompleto(false)
  }, [imagen])

  const handleSubirSucursal = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("Sucursal", JSON.stringify(datos));
    formData.append("Imagen", imagen.foto)
    console.log({ "formDara": formData });
    if (todoCompleto) {

      fetch("http://localhost:5000/sucursal/newSucursal", {
        method: "POST",
        //headers: { "Content-Type": "application/JSON" },
        body: formData,
        credentials: "include"
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(JSON.stringify({ message: data.message, status: data.status }));
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("Creacion sucursal exitosa:", data)
          setSubirSucursal(true);
        })
        .catch(error => {
          const errorData = JSON.parse(error.message)
          if (errorData.status == 405) { //Chequear que sea el mismo codigo cuando el back lo devuelva, lo dejo asi por ajhora
            setSucursalRepetida(true)
          }
          console.error("Error en la creacion de sucursal:", errorData);
        });
    }
  }


  const handleOk = () => {
    setSubirSucursal(false)
    window.location.href = routes.adminSucursales
  };

  return (
    <main className='main'>
      <form className='formSubirSucursal' onSubmit={handleSubirSucursal} encType="multipart/form-data">
        {!todoCompleto && <div className='divCampoObligatorio'>
          <p className='campoObligatorio'>*Todos los campos son obligatorios</p>
        </div>}
        <div className='div-subirsucursal-inputs'>
          <div className='div-subirsucursal-fila'>
            <div className='div-subirSucursal'>
              <label htmlFor="nombre">Nombre de la sucursal</label>
              <input type="text" name='nombre' className='inputSubirSucursal' onChange={handleChange} />
            </div>
            <div className='div-subirSucursal'>
              <label htmlFor="provincia">Provincia de la sucursal</label>
              <input type="text" name='provincia' className='inputSubirSucursal' onChange={handleChange} />
            </div>
            <div className='div-subirSucursal'>
              <label htmlFor="ciudad">Ciudad de la sucursal</label>
              <input type="text" name='ciudad' className='inputSubirSucursal' onChange={handleChange} />
            </div>
          </div>
          <div className='div-subirsucursal-fila'>
            <div className='div-subirSucursal'>
              <label htmlFor="direccion">Direccion de la sucursal</label>
              <input type="text" name='direccion' className='inputSubirSucursal' onChange={handleChange} />
            </div>
            <div className='div-subirSucursal'>
              <label htmlFor="telefono">Telefono de la sucursal</label>
              <input type="text" name='telefono' className='inputSubirSucursal' onChange={handleChange} />
            </div>

            <div className='div-subirSucursal'>
              <label htmlFor="foto">Foto de la sucursal</label>
              <input className='input-foto' id='input-foto' type="file" accept=".png, .jpg, .jpeg" name="foto"
                onChange={e => {
                  setImagen({ [e.target.name]: e.target.files[0] })
                }} />
            </div>
          </div>
        </div>

        <div className='div-botonSubirSucursal'>
          <button type="submit" className='boton-subir-sucursal'>Subir sucursal </button>
        </div>
      </form>
      <Modal texto={'La sucursal se ha creado con exito.'}
        confirmacion={subirSucursal} setConfirmacion={setSubirSucursal} handleYes={handleOk} ok={true} />
      <Modal texto={'No se pudo efectivizar el registro de la sucursal porque ya existe una sucursal con ese nombre'} confirmacion={sucursalRepetida} setConfirmacion={setSucursalRepetida} ok={true} />
    </main>
  )
}

export default SubirSucursal