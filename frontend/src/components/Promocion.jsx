// src/components/Promocion.jsx
import React, { useState } from 'react';
import '../styles/Promocion.css';
import Modal from './Modal.jsx';

function Promocion({ promo, isAdmin, hasPromos, eliminar = () => console.log("nada") }) {

    const foto = ("http://localhost:5000/img/" + promo.foto_promocion);

    const [confirmacion, setConfirmacion] = useState(false);
    const [accion, setAccion] = useState('');

    const handleYes = () => {
        setConfirmacion(false);
        if (accion === 'eliminar') {
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
                    window.location.href = routes.promociones;
                })
                .catch(error => {
                    const errorData = JSON.parse(error.message);
                    console.log(errorData.message);
                });
        } else if (accion === 'aceptar' || accion === 'rechazar') {
            // Lógica para aceptar o rechazar la promoción
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
                    eliminar();
                    window.location.href = routes.promociones;
                })
                .catch(error => {
                    const errorData = JSON.parse(error.message);
                    console.log(errorData.message);
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
        <div className={`promocion ${!promo.aprobado ? 'promocion-no-aprobada' : ''}`}>
            <img src={foto} alt={promo.titulo} className="promocion-image" />
            <h3 className="promocion-title">{promo.titulo}</h3>
            {!promo.aprobado && (
                <div className="promocion-actions">
                    <button className="promocion-button" onClick={handleAceptarPromocion}>Aceptar</button>
                    <button className="promocion-button" onClick={handleEliminarPromocion}>Rechazar</button>
                </div>
            )}
            <button className="promocion-button" onClick={handleEliminarPromocion}>Eliminar Promoción</button>

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
