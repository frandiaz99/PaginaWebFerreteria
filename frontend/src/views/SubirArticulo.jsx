import React from 'react'
import { useRef } from 'react'
import routes from '../routes'
import '../styles/SubirArticulo.css'

function SubirArticulo() {
  const tituloRef = useRef(null)
  const descripcionRef = useRef(null)
  const interesadoEnRef = useRef(null)
  const fotoRef = useRef(null)

  const handleSubirArt = () =>{
    const art = {
      titulo: tituloRef.current.value,
      descripcion: descripcionRef.current.value
    }
    fetch("http://localhost:5000/articulo/crearArticulo", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({Articulo: art}),
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
      <div className='main_subir_articulo'>
        <h1>Completá los datos para tu publicación</h1>

        <div className='titulo_descripcion'>
          <div>
            <h4>Título y descripción de tu artículo</h4>
            <hr />
          </div>
          <label htmlFor="titulo">Título</label>
          <input type="text" name='titulo' ref={tituloRef}/>
          <label htmlFor="descripcion">Descripción</label>
          <input type="text" name='descripcion' ref={descripcionRef}/>
        </div>

        <div className='interesadoEn'>
          <div>
            <h4>Estoy interesado en</h4>
            <hr />
          </div>
          <label htmlFor="interesado">Descripción</label>
          <input type="text" name='interesado' ref={interesadoEnRef}/>
        </div>

        <div className='foto'>
          <div>
            <h4>Foto de tu artículo</h4>
            <hr />
          </div>
          <p>Aca se subiria una foto del articulo</p>
          <p>a</p>
        </div>

      </div>
      <button className='boton_subirArt' onClick={handleSubirArt}>Subir artículo</button>
    </main>
  )
}

export default SubirArticulo