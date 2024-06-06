import React, { useState } from 'react';
import '../styles/PopupSucursal.css';
import Modal from "../components/Modal";

const PopupElegirSucursal = ({ show, onClose, sucursales, trueque, actualizarEstado }) => {
    if (!show) return null;

    const [sucursalTemp, setSucursalTemp] = useState()
    const [datos, setDatos] = useState({
        _id: trueque._id,
        fecha_venta: '',
        sucursal: ''
    });


    const [fechaYSucursal, setFechaYSucursal] = useState(false);

    const handleChangeSucursal = (e) => {
        setDatos({
            ...datos,
            sucursal: e.target.value
        });
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedOptionContent = selectedOption.textContent;
        setSucursalTemp({ nombre: selectedOptionContent })  //guardo solo el nombre para actualizar el estado del trueque
    };

    const handleChangeFecha = (e) => {
        setDatos({
            ...datos,
            fecha_venta: e.target.value
        });
    };

    const handleOk = () => {
        setFechaYSucursal(false);
        actualizarEstado({ fecha_venta: datos.fecha_venta, sucursal: sucursalTemp })
        onClose();
    };

    const handleSeleccionar = () => {
        fetch(
            "http://localhost:5000/trueque/setFecha",
            {
                method: "POST",
                headers: { "Content-Type": "application/JSON"},
                body: JSON.stringify({ Trueque: datos }),
                credentials: "include",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                    })
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
                    style={{ marginLeft: '10px' }}
                    type="datetime-local"
                    onChange={handleChangeFecha}
                    name="fecha_hora"
                />
                {(new Date(datos.fecha_venta) < Date.now()) && <p className="textoNoCumple">La fecha es anterior a hoy</p>}

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
