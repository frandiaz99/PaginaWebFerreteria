import React, { useState, useEffect } from 'react';
import '../styles/PopupIntercambio.css';
import routes from '../routes';
import ArticuloIntercambio from '../components/ArticuloIntercambio';
import Modal from "../components/Modal";

const PopupIntercambio = ({ show, onClose, articuloAIntercambiar }) => {
    if (!show) return null;

    const [intercambio, setIntercambio] = useState(false)
    const [articulosMismaCategoria, setArticulosMismaCategoria] = useState([])
    const [obtenido, setObtenido] = useState(false)
    const [articuloSeleccionadoPropio, setArticuloSeleccionadoPropio] = useState(null)
    const [articulo, setArticulo] = useState({
        suArticulo: articuloAIntercambiar,
        miArticulo: ''
    })


    useEffect(() => {
        fetch('http://localhost:5000/articulo/getMisArticulos',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/JSON",
                    //"Cookie": localStorage.getItem('jwt')
                }, credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                    })
                }
                return response.json();
            })
            .then(data => {
                setArticulosMismaCategoria(data.articulos.filter(a => a.precio == articuloAIntercambiar.precio))
                setObtenido(true)
            })
            .catch(error => {
                console.log('Error', error)
            });
    }, [])

    function confirmarSeleccion() {
        console.log('Articulo a intercambiar/propio: ', articuloSeleccionadoPropio)
        setArticulo({
            ...articulo,
            miArticulo: articuloSeleccionadoPropio,
        })
        setIntercambio(true)

        fetch('http://localhost:5000/articulo/intercambiarArticulo',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/JSON",
                    //"Cookie": localStorage.getItem('jwt')
                },
                body: JSON.stringify({ Articulo: articulo }),
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor al editar perfil:', data);
            })
            .catch(error => {
                const errorData = JSON.parse(error.message)
                //console.error('Hubo un problema al guardar los cambios:', error);
            })
    }

    function handleArticuloSeleccionado(articulo) {
        setArticuloSeleccionadoPropio(articulo);
    }

    function handleOk() {
        setIntercambio(false)
        window.location.href = routes.pagPrincipal
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Intercambiar Artículo</h2>
                <div className='articulos'>
                    {(articulosMismaCategoria == 0) ?
                        <div className='noHayItems'>
                            {obtenido ? 'No hay articulos disponibles aún' : 'Cargando artículos...'}
                        </div> //Podria ser un componente
                        :
                        articulosMismaCategoria.map((art, index) => (<ArticuloIntercambio key={index} articulo={art} misArticulos={false} onArticuloSeleccionado={handleArticuloSeleccionado} />))
                    }
                </div>
                <div className='botones-intercambio'>
                    <button onClick={confirmarSeleccion}>Confirmar</button>

                    <button onClick={onClose}>Cerrar</button>
                </div>
                <Modal texto={`¿Desea confirmar el intercambio?`} confirmacion={intercambio} setConfirmacion={setIntercambio} handleYes={handleOk} ok={false} />

            </div>
        </div>
    );
};

export default PopupIntercambio;
