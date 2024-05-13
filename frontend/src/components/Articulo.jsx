import { useNavigate} from 'react-router-dom'
import '../styles/Articulo.css'
import routes from '../routes'
import Modal from './Modal.jsx'
import { useState } from 'react'


function Articulo({ articulo, misArticulos }) {
    const navigate= useNavigate()
    const [confirmacion, setConfirmacion]= useState(false)

    const handleYes= () =>{
        setConfirmacion(false)
        console.log("artt_", articulo)
        fetch('http://localhost:5000/articulo/borrarArticulo', 
        {method: "DELETE", 
        headers: { "Content-Type": "application/JSON"},
        body: JSON.stringify({Articulo: articulo}),
        credentials: "include"})
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
                throw new Error(JSON.stringify({message: data.message}));
            })
          }
          return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
          const errorData= JSON.parse(error.message)
          console.log(errorData.message)
        });
    }

    const handleEliminarArt= (event) =>{
        event.stopPropagation(); 
        setConfirmacion(true)
    }

    const irArticulo= ()=>{
        if (location.pathname !== routes.pagPrincipal){
            localStorage.setItem('articulo',JSON.stringify(articulo))
        }
        navigate(routes.unArticulo)
    }

    var srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo[0];

    if(!misArticulos) return (
            <div className='articulo' onClick={irArticulo}>
                <div className='divImagenArt'>
                    <img src={srcFotoArt} alt="" className='imagenArt' />
                </div>
                <div className='articulo-contenido'>
                    <h2 className='tituloArt'>{articulo.nombre}</h2>
                    <p className='descripcionArt'>{articulo.descripcion}</p>
                    <p>Interesado en: ...</p>
                    {/* <p>Categoria</p> */}
                </div>
            </div>
    )
    else return(
        <>
            <div className='miArticulo' onClick={irArticulo}>
                <div className='divImagenArt-miArticulo'>
                    <img src={srcFotoArt} alt="" className='imagenMiArt' />
                </div>
                <div className='miArticulo-contenido'>
                    <div className='miArticulo-contenido-contenido'>
                        <h4 className='tituloArt'>{articulo.nombre}</h4>
                        {/* categoria */}
                    </div>
                    <button className='eliminarMiArticulo' onClick={handleEliminarArt}>Eliminar articulo</button>
                </div>
            </div>
            <Modal texto={'¿Estás seguro que querés eliminar este artículo?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={false}/>
        </>
    )
}

export default Articulo