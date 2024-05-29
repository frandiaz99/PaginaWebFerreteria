import React, { useState } from 'react';
import '../styles/PopupSucursal.css';
import routes from '../routes';
import Modal from "../components/Modal";

const PopupElegirSucursal = ({ show, onClose, sucursales, onSeleccionar }) => {
    if (!show) return null;

    const [sucursalSeleccionada, setSucursalSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');

    const [fecha, setFecha] = useState('')

    const [datos, setDatos] = useState(false)

    const handleSeleccionar = () => {
        onSeleccionar(sucursalSeleccionada, fechaSeleccionada);
        setDatos(true);
        onClose();
    };

    const handleOk = () => {
        setDatos(false);
        onClose();
    }

    return (
        <div className="popup-overlay-sucursal">
            <div className='popup-sucursal'>
                <button className='cerrar-popup' onClick={onClose}>x</button>
                <h2>Elegir Sucursal</h2>
                <select
                    value={sucursalSeleccionada}
                    onChange={(e) => setSucursalSeleccionada(e.target.value)}
                >
                    <option value="">Seleccione una sucursal</option>
                    {sucursales.map(sucursal => (
                        <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                />
                <div className='botones-sucursal'>
                    <button onClick={handleSeleccionar}>Aceptar</button>
                </div>
            </div>
            <Modal texto={'La sucursal y fecha se han establecido con exito.'}
                confirmacion={datos} setConfirmacion={setDatos} handleYes={handleOk} ok={true} />
        </div>
    );
};

export default PopupElegirSucursal;


