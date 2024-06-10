// src/components/Promocion.jsx
import React from 'react';
import '../styles/Promocion.css';

function Promocion({ promo, isAdmin, hasPromos }) {
    return (
        <div className="promocion">
            <img src={promo.image} alt={promo.title} className="promocion-image" />
            <h3 className="promocion-title">{promo.title}</h3>
        </div>
    );
}

export default Promocion;
