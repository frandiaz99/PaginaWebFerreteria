import React, { useState } from 'react';
import '../styles/PopupSucursal.css';
import routes from '../routes';
import Modal from "../components/Modal";

const PopupElegirSucursal = ({ show, onClose, sucursales, trueque }) => {
    if (!show) return null;

    const [datos, setDatos] = useState({
        fecha_venta: '',
        sucursal: ''
    })

    const [fechaYSucursal, setFechaYSucursal] = useState(false)


    const handleChangeSucursal = (e) => {
        setDatos({
            ...datos,
            sucursal: e.targe.value
        })
    }

    const handleChangeFecha = (e) => {
        setDatos({
            ...datos,
            fecha_venta: e.target.value
        })
    }

    const handleOk = () => {
        setFechaYSucursal(false);
        onClose();
    }

    const handleSeleccionar = () => {

        console.log("aaaaaaaaaaaaaaaaaaa: ", datos)

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
                console.log("fecha y sucrusal: ", data)
                fechaYSucursal(true);

            })
            .catch((error) => {
                console.error("Hubo un problema al guardar los cambios:", error);
                // Manejo de errores
            });
    }

    return (
        <div className="popup-overlay-sucursal">
            <div className='popup-sucursal'>
                <button className='cerrar-popup' onClick={onClose}>x</button>
                <h2>Elegir Sucursal</h2>
                <select name="sucursal" onChange={handleChangeSucursal}>
                    <option value="">Seleccione una sucursal</option>
                    {sucursales.map((s, index) => (<option key={index} value={s._id}>{s.nombre}</option>))}
                </select>
                <input
                    type="date"
                    onChange={handleChangeFecha}
                    name="fecha"
                />
                <div className='botones-sucursal'>
                    <button onClick={handleSeleccionar}>Aceptar</button>
                </div>
            </div>
            <Modal texto={'La sucursal y fecha se han establecido con exito.'}
                confirmacion={fechaYSucursal} setConfirmacion={setFechaYSucursal} handleYes={handleOk} ok={true} />
        </div>
    );
};

export default PopupElegirSucursal;


