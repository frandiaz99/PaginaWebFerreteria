import React, { useState } from 'react';
import '../styles/PopupSucursal.css';
import Modal from "../components/Modal";

const PopupElegirSucursal = ({ show, onClose, sucursales, trueque }) => {
    if (!show) return null;

    const [datos, setDatos] = useState({
        _id: trueque._id,
        fecha_venta: '',
        sucursal: ''
    });

    console.log("aaaaaaaaaaaaa -----------> ", datos)

    const [fechaYSucursal, setFechaYSucursal] = useState(false);

    const handleChangeSucursal = (e) => {
        setDatos({
            ...datos,
            sucursal: e.target.value
        });
    };

    const handleChangeFecha = (e) => {
        setDatos({
            ...datos,
            fecha_venta: e.target.value
        });
    };

    const handleOk = () => {
        setFechaYSucursal(false);
        console.log("bbbbbbbbbbb -----------> ", datos)
        onClose();
    };

    const handleSeleccionar = () => {
        fetch(
            "http://localhost:5000/trueque/setFecha",
            {
                method: "POST",
                body: JSON.stringify({ Trueque: datos }),
                credentials: "include",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Hubo un problema al guardar los cambios");
                }
                return response.json();
            })
            .then((data) => {
                console.log("fecha y sucursal: ", data)
                setFechaYSucursal(true);
            })
            .catch((error) => {
                console.error("Hubo un problema al guardar los cambios:", error);
                // Manejo de errores
            });
    };

    return (
        <div className="popup-overlay-sucursal">
            <div className='popup-sucursal'>
                <button className='cerrar-popup' onClick={onClose}>x</button>
                <h2>Elegir Sucursal</h2>
                <select name="sucursal" onChange={handleChangeSucursal}>
                    <option value="">Seleccione una sucursal</option>
                    {sucursales.map((s, index) => (
                        <option key={index} value={s._id}>{s.nombre}</option>
                    ))}
                </select>
                <input
                    type="datetime-local"
                    onChange={handleChangeFecha}
                    name="fecha_hora"
                />
                <div className='botones-sucursal'>
                    <button onClick={handleSeleccionar}>Aceptar</button>
                </div>
            </div>
            <Modal
                texto={'La sucursal y fecha se han establecido con éxito.'}
                confirmacion={fechaYSucursal}
                setConfirmacion={setFechaYSucursal}
                handleYes={handleOk}
                ok={true}
            />
        </div>
    );
};

export default PopupElegirSucursal;
