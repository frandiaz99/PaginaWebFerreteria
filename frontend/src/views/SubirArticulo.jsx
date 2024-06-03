import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import routes from '../routes'
import '../styles/SubirArticulo.css'
import Modal from '../components/Modal'

function SubirArticulo() {
  const [fotoSubida,setFotoSubida]= useState(null)
  const [hayNombre, setHayNombre]= useState(null)
  const [hayDescripcion, setHayDescripcion]= useState(null)
  const [hayInteres, setHayInteres]= useState(null)
  const [artSubido, setArtSubido] = useState(false)

  const [datos, setDatos] = useState({
    nombre: '',
    descripcion: '',
    interesado: '',
  })

  const [imagen, setImagen] = useState({ foto: "" })

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }

  const fotos = [];

  const handleBlurName= () =>{
    if (datos.nombre == '') setHayNombre(false)
    else setHayNombre(true)
  }

  const handleBlurDescripcion= () =>{
    if (datos.descripcion == '') setHayDescripcion(false)
    else setHayDescripcion(true)
  }

  const handleBlurInteres= () =>{
    if (datos.interesado == '') setHayInteres(false)
    else setHayInteres(true)
  }


  const handleSubirArt = (event) => {
    event.preventDefault();
    const formData = new FormData()
    formData.append("Articulo", JSON.stringify(datos));
    for (let i = 0; i < imagen.foto.length; i++) {
      console.log("antes", imagen.foto[i])
      formData.append("Imagen", imagen.foto[i])
    }


    //console.log({ "Imagen": imagen.foto });
    console.log({ "form Data": formData });
    console.log({ "form Data imagen ": formData.Imagen });
    if (fotoSubida && hayNombre && hayDescripcion && hayInteres){
      fetch("http://localhost:5000/articulo/crearArticulo", {
        method: "POST",
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
  }

  const handleOk = () => {
    setArtSubido(false)
    window.location.reload();
  }


  return (
    <main className='main' >
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
                <div className='conjunto_campo_obligatorio'>
                  <input onBlur={handleBlurName} autoComplete="off" className='input-subirArt' type="text" id='nombreArt' name='nombre' maxLength={30} onChange={handleChange} />
                  {hayNombre== false && <span className='campoObligatorio'>Campo obligatorio</span>}
                </div>
              </div>
              <div className='descripcion-section1'>
                <label className='label-subirArt' >Descripción</label>
                <div classname='conjunto_campo_obligatorio'>
                  <textarea onBlur={handleBlurDescripcion} className='textArea-subirArt' id='descripcionArt' name='descripcion' onChange={handleChange} />
                 {hayDescripcion== false && <span className='campoObligatorio'>Campo obligatorio</span>}
                </div>
              </div>

            </div>
          </div>


          <div className='section2-subirArt'>
            <div className='titulo-section2'>
              <h4>Artículos de tu interes</h4>
              <hr />
            </div>

            <div className='descripcion-section2'>
              <div className='conjunto_campo_obligatorio'>
                <input onBlur={handleBlurInteres} className='input-subirArt' type="text" id='interesadoArt' name='interesado' placeholder='Martillo, llave inglesa, destornillador Phillips, linterna.' onChange={handleChange} autoComplete="off" />
                {hayInteres== false && <span className='campoObligatorio'>Campo obligatorio</span>}
              </div>
            </div>
          </div>


          <div className='section3-subirArt'   >
            <div className='titulo-section3'>
              <h4>Fotos de tu artículo</h4>
              <hr />
            </div>

            <div className='foto-section3'>
              <input id='fotoSubirArt' type="file" accept=".png, .jpg, .jpeg" multiple name="foto"
                onFocus={() =>{
                  if (imagen.foto.length == 0) setFotoSubida(false)
                  else setFotoSubida(true)}}
                onChange={e => {
                  setImagen({ [e.target.name]: e.target.files })
                  fotos.push(Array.from(e.target.files));
                  if (e.target.files.length == 0) setFotoSubida(false)
                  else setFotoSubida(true)
                  console.log("fotos", fotos)
                }} />
                {fotoSubida == false && <span className='campoObligatorio'>Campo obligatorio</span>}
              {/* <div className='verImagenes'>

              </div> */}
            </div>
          </div>


        </div>

        <div className='divBotonSubirArt'>
          <button type="submit" className='boton-subirArt'>Subir artículo</button>
          <Link to={routes.pagPrincipal}><button className='boton-cancelarArt'>Cancelar</button></Link>
        </div>

      </form>
      <Modal texto={'¡Listo! Tu artículo estará disponible luego de que lo tasen.'} confirmacion={artSubido} setConfirmacion={setArtSubido} handleYes={handleOk} ok={true} />
    </main>
  )
}

export default SubirArticulo