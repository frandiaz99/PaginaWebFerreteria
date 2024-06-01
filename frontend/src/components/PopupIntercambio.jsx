import React, { useState, useEffect } from 'react';
import '../styles/PopupIntercambio.css';
import routes from '../routes';
import ArticuloIntercambio from '../components/ArticuloIntercambio';
import Modal from "../components/Modal";

const PopupIntercambio = ({ show, onClose, articuloAIntercambiar }) => {
    if (!show) return null;

    const [confirmar, setConfirmar]= useState(true)
    const [intercambio, setIntercambio] = useState(false)
    const [articulosMismaCategoria, setArticulosMismaCategoria] = useState([])
    const [obtenido, setObtenido] = useState(false)
    const [articuloSeleccionadoPropio, setArticuloSeleccionadoPropio] = useState(null)
    const [articuloSeleccionadoPropioID, setArticuloSeleccionadoPropioID]= useState(0)
    const [articulosQueYaOfreci, setArticulosQueYaOfreci]= useState(null)
   /* const [articulo, setArticulo] = useState({
        suArticulo: articuloAIntercambiar,
        miArticulo: ''
    })*/


    useEffect(() =>{
        fetch('http://localhost:5000/trueque/getPendientes',
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
        .then(dataPendientes => {
            const cuentaActual= JSON.parse(localStorage.getItem('user'))

            const truequesPendientes= dataPendientes.data
            const truequesDelArticuloAIntercambiar= truequesPendientes.filter(t => t.articulo_publica._id == articuloAIntercambiar._id || t.articulo_compra._id == articuloAIntercambiar._id)
            const articulosPublica= truequesDelArticuloAIntercambiar.map(t => t.articulo_publica)
            const articulosCompra= truequesDelArticuloAIntercambiar.map(t => t.articulo_compra)
            
            setArticulosQueYaOfreci([
                ...articulosPublica.filter(a => a.usuario._id == cuentaActual._id),
                ...articulosCompra.filter(a => a.usuario._id == cuentaActual._id)
            ])
            console.log("art q ya ofreci", articulosQueYaOfreci)
        })
        .catch(error => {
            console.log('Error', error)
            setArticulosQueYaOfreci(false)
        });
    },[])

    useEffect(() => {
        if (articulosQueYaOfreci !== null){

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
                .then(dataMisArticulos => {
                    var mismaCategoria=dataMisArticulos.articulos.filter(a => a.precio == articuloAIntercambiar.precio)
                    if (articulosQueYaOfreci) setArticulosMismaCategoria(mismaCategoria.filter(a => !articulosQueYaOfreci.some(ofrecido => ofrecido._id == a._id)))
                    else setArticulosMismaCategoria(mismaCategoria)    
                    setObtenido(true)
                })
                .catch(error => {
                    console.log('Error', error)
                    setObtenido(true)
                });
        }
    }, [articulosQueYaOfreci])


    function confirmarSeleccion() {
        if (articuloSeleccionadoPropio){
            setConfirmar(false)
            /*setArticulo({
                ...articulo,
                "miArticulo": articuloSeleccionadoPropio,
            })*/
            fetch('http://localhost:5000/articulo/intercambiarArticulo',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/JSON",
                        //"Cookie": localStorage.getItem('jwt')
                    },
                    body: JSON.stringify({ Articulo: {suArticulo :articuloAIntercambiar, miArticulo: articuloSeleccionadoPropio} }),
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
                    console.log('Respuesta del servidor:', data);
                    setArticulosMismaCategoria(articulosMismaCategoria.filter(a => a._id !== data.data.articulo_compra._id ))
                    setIntercambio(true)
                    setConfirmar(true)
                })
                .catch(error => {
                    console.log("Error", error)
                })
        }
    }

    function handleArticuloSeleccionado(articulo) {
        setArticuloSeleccionadoPropio(articulo);
        setArticuloSeleccionadoPropioID(articulo._id)
    }

    function handleOk() {
        setIntercambio(false)
        onClose()
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Intercambiar Artículo</h2>
                <div className='articulos'>
                    {confirmar
                    ?
                        (articulosMismaCategoria.length == 0) ?
                            <div className='noHayItems'>
                                {obtenido ? 'No tenés artículos en la misma categoría o ya los ofreciste' : 'Cargando artículos...'}
                            </div> //Podria ser un componente
                            :
                            obtenido && articulosMismaCategoria.map((art, index) => (<ArticuloIntercambio key={index} articulo={art} onArticuloSeleccionado={handleArticuloSeleccionado} isSelected={articuloSeleccionadoPropioID == art._id}/>))
                    :
                        'Creando intercambio...'
                    }
                </div>
                <div className='botones-intercambio'>
                    {(obtenido && articulosMismaCategoria.length > 0 && confirmar) && <button onClick={confirmarSeleccion}>Confirmar</button>}

                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
            <Modal texto={'El intercambio se ha guardado con exito.'}
                confirmacion={intercambio} setConfirmacion={setIntercambio} handleYes={handleOk} ok={true} />
            {/* <Modal texto={`¿Desea confirmar el intercambio?`} confirmacion={intercambio} setConfirmacion={setIntercambio} handleYes={handleOk} ok={false} /> */}
        </div>
    );
};

export default PopupIntercambio;