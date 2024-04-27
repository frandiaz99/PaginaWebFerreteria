import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import routes from '../routes'
import '../styles/SubirArticulo.css'

function SubirArticulo() {
  const nombreRef = useRef(null)
  const descripcionRef = useRef(null)
  const interesadoEnRef = useRef(null)
  const fotoRef = useRef(null)
  const navigate= useNavigate();

  const handleSubirArt = (event) =>{
    event.preventDefault();
    const art = {
      titulo: nombreRef.current.value,
      descripcion: descripcionRef.current.value
    }
    fetch("http://localhost:5000/articulo/crearArticulo", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({Articulo: art}),
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
      //Podría ir una pantalla de carga
      navigate(routes.userPrincipal);
    })
    .catch(error => {
      console.error("Error en la creacion del art:", error.message);
    });   
  }

  return (
    <main className='main'>
      <form className='formSubirArt' onSubmit={handleSubirArt}>

        <div className='main-subirArt'>
          <h1 className='titulo-subirArt'>
            Completá los datos para tu publicación
          </h1>


          <div className='section1-subirArt'>
            <div className='titulo-section1-subirArt'>
              <h4>Nombre y descripción de tu artículo</h4>
              <hr />
            </div>

            <div className='nombreYdescripcion-section1'>

              <div className='nombre-section1'>
                <label className='label-subirArt' htmlFor="nombreArt">Nombre</label>
                <input className='input-subirArt' type="text" id='nombreArt' name='nombre' maxLength={30} ref={nombreRef}/>
              </div>

              <div className='descripcion-section1'>
                <label className='label-subirArt' htmlFor="descripcionArt">Descripción</label>
                <textarea className='textArea-subirArt' id='descripcionArt' name='descripcion' ref={descripcionRef}/>
              </div>

            </div>
          </div>


          <div className='section2-subirArt'>
            <div className='titulo-section2'>
              <h4>Estoy interesado en</h4>
              <hr />
            </div>

            <div className='descripcion-section2'>
              <input className='input-subirArt' type="text" id='interesadoArt' name='interesado' placeholder='ej: Martillo, llave inglesa, destornillador Phillips, linterna o cinta metrica.' ref={interesadoEnRef}/>
            </div>
          </div>


          <div className='section3-subirArt'>
            <div className='titulo-section3'>
              <h4>Foto de tu artículo</h4>
              <hr />
            </div>

            <p>Aca se subiria una foto del articulo</p>
          </div>


        </div>

        <div className='divBotonSubirArt'>
          <button className='boton-subirArt'>Subir artículo</button>
        </div>

      </form>
    </main>
  )
}

export default SubirArticulo