import { useNavigate } from 'react-router-dom';
import '../styles/Articulo.css';
import routes from '../routes.js';
import Modal from './Modal.jsx';
import { useState, useRef } from 'react';

function ArticuloIntercambio({ articulo, onArticuloSeleccionado, isSelected}) {
    const srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo[articulo.foto_articulo.length - 1];

    function seleccionarArticulo() {
        console.log('Articulo seleccionado: ', articulo);
        onArticuloSeleccionado(articulo)
    }
    

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
