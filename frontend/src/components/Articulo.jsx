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
        window.location.reload();
    }

    const handleEliminarArt= (event) =>{
        event.stopPropagation(); 
        setConfirmacion(true)
    }

    const irArticulo= ()=>{
        navigate(routes.unArticulo)
    }

    var srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo;

    if(!misArticulos) return (
            <div className='articulo' onClick={irArticulo}>
                <div className='divImagenArt'>
                    <img src={srcFotoArt} alt="" className='imagenArt' />
                </div>
                <div className='articulo-contenido'>
                    <h2 className='tituloArt'>{articulo.nombre}</h2>
                    <p className='descripcionArt'>{articulo.descripcion}</p>
                    <p>Interesado en: ...</p>
                    <span className='span'>${articulo.precio}</span>
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
                        <span className='span'>${articulo.precio}</span>
                    </div>
                    <button className='eliminarMiArticulo' onClick={handleEliminarArt}>Eliminar articulo</button>
                </div>
            </div>
            <Modal texto={'¿Estás seguro que querés eliminar este artículo?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={false}/>
        </>
    )
}

export default Articulo