import React, { useState } from 'react'
import '../styles/SubirSucursal.css'

function SubirSucursal() {
  const [datos, setDatos] = useState({
    nombre: '',
    provincia: '',
    ciudad: '',
    direccion: '',
    telefono: ''
  })

  const [imagen, setImagen] = useState({ foto: "" })

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubirSucursal = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("Sucursal", JSON.stringify(datos));
    formData.append("Imagen", imagen.foto)
    console.log({ "formDara": formData });

    fetch("http://localhost:5000/sucursal/newSucursal", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: formData,
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || "Error al crear sucursal");
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Creacion sucursal exitosa:", data)
      })
      .catch(error => {
        console.error("Error en la creacion de sucursal:", error.message);
      });
  }
  return (
    <main className='main'>
      <form className='formSubirSucursal' onSubmit={handleSubirSucursal} encType="multipart/form-data">
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
        <div className='div-subirSucursal'>
          <label htmlFor="direccion">Direccion de la sucursal</label>
          <input type="text" name='direccion' className='inputSubirSucursal' onChange={handleChange} />
        </div>
        <div className='div-subirSucursal'>
          <label htmlFor="telefono">Telefono de la sucursal</label>
          <input type="text" name='telefono' className='inputSubirSucursal' onChange={handleChange} />
        </div>

        <div className='div-subirSucursañ'>
          <input id='input-fott' type="file" accept=".png, .jpg, .jpeg" multiple name="foto"
            onChange={e => {
              console.log({ "name": e.target.name })
              console.log(e.target.files[0])
              setImagen({ [e.target.name]: e.target.files[0] })
              console.log("foto", foto)

            }} />
        </div>

        <div className='div-botonSubirSucursal'>
          <button type="submit" className='registrarse'>Subir sucursal </button>
        </div>
      </form>
    </main>
  )
}

export default SubirSucursal