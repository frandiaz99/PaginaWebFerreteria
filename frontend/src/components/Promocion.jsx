import React, { useState } from 'react';
import '../styles/Promocion.css';
import Modal from './Modal.jsx';
import routes from '../routes';
import { estaEnModoAdmin, estaEnModoEmple } from '../helpers/estaEnModo.js';
import { useNavigate } from 'react-router-dom';

function Promocion({ promo, isAdmin, hasPromos, eliminar = () => console.log("nada") }) {

    const navigate = useNavigate();
    const foto = ("http://localhost:5000/img/" + promo.foto_promocion);

    const [confirmacion, setConfirmacion] = useState(false);
    const [accion, setAccion] = useState('');
    const [aprobado, setAprobado] = useState(promo.aprobado); // State to manage approval status

    const handleYes = () => {
        setConfirmacion(false);
        if (accion === 'eliminar' || accion === 'rechazar') {
            console.log("sucursal --> ", promo);
            fetch('http://localhost:5000/promocion/eliminarPromocion', {
                method: "DELETE",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ Promocion: promo }),
                credentials: "include"
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(JSON.stringify({ message: data.message }));
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    eliminar();
                    navigate(routes.promociones);
                })
                .catch(error => {
                    try {
                        const errorData = JSON.parse(error.message);
                        console.log(errorData.message);
                    } catch (e) {
                        console.error("Error message is not in JSON format:", error.message);
                    }
                });
        } else if (accion === 'aceptar') {
            // Lógica para aceptar o rechazar la promoción
            promo.aprobado = true;

            fetch(`http://localhost:5000/promocion/${accion}Promocion`, {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ Promocion: promo }),
                credentials: "include"
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(JSON.stringify({ message: data.message }));
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    setAprobado(true); // Update the local state to reflect the new approval status
                    eliminar();
                    navigate(routes.promociones);
                })
                .catch(error => {
                    try {
                        const errorData = JSON.parse(error.message);
                        console.log(errorData.message);
                    } catch (e) {
                        console.error("Error message is not in JSON format:", error.message);
                    }
                });
        }
    };


    const handleEliminarPromocion = (event) => {
        event.stopPropagation();
        setAccion('eliminar');
        setConfirmacion(true);

    };

    const handleAceptarPromocion = (event) => {
        event.stopPropagation();
        setAccion('aceptar');
        setConfirmacion(true);

    };

    const handleRechazarPromocion = (event) => {
        event.stopPropagation();
        setAccion('rechazar');
        setConfirmacion(true);

    };

    return (
        <div className={`promocion ${!aprobado ? 'promocion-no-aprobada' : ''}`}>
            <img src={foto} alt={promo.titulo} className="promocion-image" />
            <h3 className="promocion-title">{promo.titulo}</h3>
            {aprobado === false && (
                <div className="promocion-actions">
                    <button className="promocion-button" onClick={handleAceptarPromocion}>Aceptar</button>
                    <button className="promocion-button" onClick={handleRechazarPromocion}>Rechazar</button>
                </div>
            )}
            {aprobado != false && (estaEnModoAdmin() || estaEnModoEmple()) && (
                <button className="promocion-button" onClick={handleEliminarPromocion}>Eliminar Promoción</button>
            )}


            <Modal
                texto={`¿Estás seguro que querés ${accion} la promocion?`}
                confirmacion={confirmacion}
                setConfirmacion={setConfirmacion}
                handleYes={handleYes}
                ok={false}
            />
        </div>
    );
}

export default Promocion;
