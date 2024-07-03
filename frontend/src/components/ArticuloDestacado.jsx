import { useNavigate} from 'react-router-dom'
import '../styles/ArticuloDestacado.css'
import routes from '../routes.js'
import { useEffect, useState } from 'react'


function ArticuloDestacado({articulo, misArticulos}) {
    const navigate= useNavigate()
    const [irAUnArticulo, setIrAUnArticulo]= useState(false)

    const irArticulo= ()=>{
        if (location.pathname !== routes.pagPrincipal /*invitado*/){
            localStorage.setItem('articulo',JSON.stringify(articulo))
        }
        setIrAUnArticulo(true)
    }

    useEffect(() => {
        if (irAUnArticulo) navigate(routes.unArticulo)
    }, [irAUnArticulo])

    var srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo[articulo.foto_articulo.length-1];

    if(!misArticulos) return (
        <div className='articulo' id='articulo-destacado' onClick={irArticulo}>
            <div className='divImagenArt'>
                <img src={srcFotoArt} alt="" className='imagenArt' id='img-destacado'/>
            </div>
            <div className='articulo-contenido' id='articulo-contenido-destacado'>
                <h2 className='tituloArt'>{articulo.nombre}</h2>
                <span>${articulo.promocionado.duracion * 2000}</span>
            </div>
        </div>
    )
}

export default ArticuloDestacado