import { Link } from 'react-router-dom'
import '../styles/Articulo.css'
import routes from '../routes'

function Articulo({ articulo }) {
    var srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo;
    return (

        <Link to={routes.unArticulo} className='link'>
            <div className='articulo'>
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
        </Link>

    )
}

export default Articulo