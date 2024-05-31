import React, { useState } from 'react';
import '../styles/PopupEfectivizar.css';
import routes from '../routes';
import Modal from "../components/Modal";

const PopupEfectivizar = ({ show, onClose, truequeAEfectivizar, efectivizar }) => {
    if (!show) return null;

    const [ventas, setVentas] = useState([{ codigo: '', cantidad: '', usuario: '' }]);
    const [confirmado, setConfirmado] = useState(false);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        setVentas(prevVentas => {
            const newVentas = [...prevVentas];
            newVentas[index][name] = value;
            return newVentas;
        });
    };

    const agregarProducto = () => {
        setVentas(prevVentas => [...prevVentas, { codigo: '', cantidad: '', usuario: '' }]);
    };

    const eliminarProducto = (index) => {
        setVentas(prevVentas => prevVentas.filter((_, i) => i !== index));
    };

    const confirmarSeleccion = () => {
        fetch('http://localhost:5000/trueque/efectivizarTrueque', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Cookie": localStorage.getItem('jwt')
            },
            body: JSON.stringify({ Trueque: truequeAEfectivizar, Efectivizar: efectivizar }),
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
                setConfirmado(true);
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    const handleOk = () => {
        setConfirmado(false);
        window.location.href = routes.pagPrincipal;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        confirmarSeleccion();
    };

    const buttonText = efectivizar ? 'Registrar Venta / Efectivizar Trueque' : 'Registrar Venta / Cancelar Trueque';
    const buttonClass = efectivizar ? 'aceptar' : 'cancelar';

    return (
        <div className="popup-overlay-venta">
            <div className='popup-venta'>
                <button className='cancelar-venta' onClick={onClose}>x</button>
                <h2>Agregar venta</h2>
                <form onSubmit={handleSubmit} className='inputs-venta'>
                    {ventas.map((venta, index) => (
                        <div className='input-row' key={index}>
                            <input
                                type="text"
                                name='codigo'
                                placeholder="Id producto venta"
                                value={venta.codigo}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            <input
                                type="text"
                                name='cantidad'
                                placeholder="Cantidad"
                                value={venta.cantidad}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            <select
                                name='usuario'
                                value={venta.usuario}
                                onChange={(e) => handleInputChange(index, e)}
                            >
                                <option value="">Seleccione usuario</option>
                                <option value={truequeAEfectivizar.articulo_compra.usuario.dni}>
                                    {truequeAEfectivizar.articulo_compra.usuario.dni}
                                </option>
                                <option value={truequeAEfectivizar.articulo_publica.usuario.dni}>
                                    {truequeAEfectivizar.articulo_publica.usuario.dni}
                                </option>
                            </select>
                            <button type="button" className='remove-row' onClick={() => eliminarProducto(index)}>x</button>
                        </div>
                    ))}
                    <div className='botones-venta'>
                        <button type='submit' className={buttonClass} onClick={confirmarSeleccion}>{buttonText}</button>
                        <button type='button' className='agregar-producto' onClick={agregarProducto}>Agregar Producto</button>
                    </div>
                </form>
                <Modal
                    texto={'La venta se ha agregado con éxito.'}
                    confirmacion={confirmado}
                    setConfirmacion={setConfirmado}
                    handleYes={handleOk}
                    ok={true}
                />
            </div>
        </div>
    );
};

export default PopupEfectivizar;
