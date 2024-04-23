import { Link } from 'react-router-dom'
import'../styles/Articulo.css'
import routes from '../routes'

function Articulo ({articulo}){
    return (
        <div className='articulo-link'>

        <Link to={routes.unArticulo} className='link'>
            <div className='articulo'>
                <img src={articulo.src} alt="" />
                <div className='articulo-contenido'>
                    <h2>{articulo.titulo}</h2>
                    <p>{articulo.descripcion}. Definir un maximo de caracteres.</p>
                    <span className='span'>${articulo.precio}</span>
                </div>
            </div>
        </Link>
        </div>
    )
}

export default Articulo