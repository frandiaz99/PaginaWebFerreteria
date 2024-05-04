import { Link } from 'react-router-dom'
import '../styles/Articulo.css'
import routes from '../routes'

function Articulo({ articulo }) {
    return (


        <Link to={routes.unArticulo} className='link'>
            <div className='articulo'>
                <img src={articulo.src} alt="" className='imagenArt' />
                <div className='articulo-contenido'>
                    <h2 className='tituloArt'>{articulo.titulo}</h2>
                    <p className='descripcionArt'>{articulo.descripcion}. Definir un maximo de caracteres.</p>
                    <span className='span'>${articulo.precio}</span>
                </div>
            </div>
        </Link>

    )
}

export default Articulo