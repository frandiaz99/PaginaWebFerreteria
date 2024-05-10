import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import routes from '../routes'
import '../styles/SubirArticulo.css'
import Modal from '../components/Modal'

function SubirArticulo() {
  const navigate= useNavigate();
  const [artSubido, setArtSubido]= useState(false)

  const [datos, setDatos] = useState({
    nombre: '',
    descripcion: '',
    interesado: '',
  })

  const [imagen, setImagen] = useState({foto: ""})

  const handleChange = (e) => {
    setDatos({...datos,
    [e.target.name]: e.target.value,
    })
  }


  const handleSubirArt = (event) =>{
    event.preventDefault();
    const formData = new FormData();
    formData.append("Articulo", JSON.stringify(datos));
    formData.append("Imagen", imagen.foto);
    console.log({"form Data": formData});

    /*
    event.preventDefault();
    const art = {
      titulo: nombreRef.current.value,
      descripcion: descripcionRef.current.value
    }*/
    fetch("http://localhost:5000/articulo/crearArticulo", {
      method: "POST",
      //headers: { "Content-Type": "application/JSON" },
      //body: JSON.stringify({Articulo: art}),
      body: formData,
      credentials: "include"
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || "Error al crear articulo");
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Creacion articulo exitosa:", data)
      setArtSubido(true)
    })
    .catch(error => {
      console.error("Error en la creacion del art:", error.message);
    });   
  }

  const handleOk= () =>{
    setArtSubido(false)
    window.location.reload();
  }

  return (
    <main className='main'>
      <form className='formSubirArt' onSubmit={handleSubirArt} encType="multipart/form-data">

        <div className='main-subirArt'>
          <h2 className='titulo-subirArt'>
            Completá los datos para tu publicación
          </h2>


          <div className='section1-subirArt'>
            <div className='titulo-section1-subirArt'>
              <h4>Nombre y descripción de tu artículo</h4>
              <hr />
            </div>

            <div className='nombreYdescripcion-section1'>

              <div className='nombre-section1'>
                <label className='label-subirArt' >Nombre</label>
                <input autoComplete="off" className='input-subirArt' type="text" id='nombreArt' name='nombre' maxLength={30} onChange={handleChange}/>
              </div>

              <div className='descripcion-section1'>
                <label className='label-subirArt' >Descripción</label>
                <textarea className='textArea-subirArt' id='descripcionArt' name='descripcion' onChange={handleChange}/>
              </div>

            </div>
          </div>


          <div className='section2-subirArt'>
            <div className='titulo-section2'>
              <h4>Artículos de tu interes</h4>
              <hr />
            </div>

            <div className='descripcion-section2'>
              <input className='input-subirArt' type="text" id='interesadoArt' name='interesado' placeholder='Ej: Martillo, llave inglesa, destornillador Phillips, linterna o cinta metrica.' onChange={handleChange} autoComplete="off"/>
            </div>
          </div>


          <div className='section3-subirArt'   >
            <div className='titulo-section3'>
              <h4>Fotos de tu artículo</h4>
              <hr />
            </div>

            <div className='foto-section3'>
              <input id='fotoSubirArt' type="file" accept=".png, .jpg, .jpeg" name="foto" 
              onChange={e => {
                              console.log ({"name": e.target.name})
                              console.log ( e.target.files[0])
                              setImagen({[e.target.name]: e.target.files[0]})
                              console.log ( imagen);
              }} />
            </div>
          </div>


        </div>

        <div className='divBotonSubirArt'>
          <button type="submit" className='boton-subirArt'>Subir artículo</button>
        </div>

      </form>
      <Modal texto={'¡Listo! Tu artículo estará disponible luego de que lo tasen.'} confirmacion={artSubido} setConfirmacion={setArtSubido} handleYes={handleOk} ok={true} />
    </main>
  )
}

export default SubirArticulo