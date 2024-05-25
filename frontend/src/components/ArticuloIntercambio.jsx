import { useNavigate } from 'react-router-dom';
import '../styles/Articulo.css';
import routes from '../routes.js';
import Modal from './Modal.jsx';
import { useState } from 'react';

function ArticuloIntercambio({ articulo, onArticuloSeleccionado }) {
    const navigate = useNavigate();
    const [confirmacion, setConfirmacion] = useState(false);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

    const srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo[articulo.foto_articulo.length - 1];

    function seleccionarArticulo() {
        setArticuloSeleccionado(articulo);
        console.log('Articulo seleccionado: ', articulo);
        setConfirmacion(true);
        onArticuloSeleccionado(articulo)
    }

    function confirmarSeleccion() {
        // Aquí puedes manejar el envío de los datos seleccionados
        console.log("Artículo seleccionado:", articuloSeleccionado);
        // Realizar navegación o cualquier otra acción necesaria
        setConfirmacion(false);
    }

    function cancelarSeleccion() {
        setConfirmacion(false);
        setArticuloSeleccionado(null);
    }

    const isSelected = articuloSeleccionado && articuloSeleccionado.id === articulo.id;

    return (
        <div
            className={`articulo articulo-intercambio ${isSelected ? 'seleccionado' : ''}`}
            onClick={seleccionarArticulo}
        >
            <div className='divImagenArt'>
                <img src={srcFotoArt} alt="" className='imagenArt' />
            </div>
            <div className='articulo-contenido'>
                <h2 className='tituloArt'>{articulo.nombre}</h2>
                <p className='descripcionArt'>{articulo.descripcion}</p>
                <p>Categoria {articulo.precio}</p>
                <p>Interesado en: ...</p>
            </div>
        </div>
    );
}

export default ArticuloIntercambio;
