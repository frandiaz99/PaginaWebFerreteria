// src/components/Promociones.jsx
import React, { useState, useEffect } from 'react';
import Promocion from '../components/Promocion';
import '../styles/Promociones.css';
import { estaEnModoAdmin, estaEnModoEmple } from '../helpers/estaEnModo';
import routes from '../routes';
import { useNavigate } from 'react-router-dom';

function Promociones({ isAdmin }) {
  const navigate = useNavigate()
  const [promos, setPromos] = useState([]);
  const [obtenido, setObtenido] = useState(false)
  const [subirPromocion, setSubirPromocion] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5000/promocion/getPromociones',
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
        setPromos(data)
        setObtenido(true)
      })
      .catch(error => {
        const errorData = JSON.parse(error.message)
        console.log(errorData.message)
      });
  }, [])

  const handleCrearPromocion = () => {
    navigate(routes.crearPromocion)
  }

  return (
    <main className="main">
      <div className="promociones-container">
        {promos.length > 0 ? (
          promos.map(promo => (
            <Promocion key={promo.id} promo={promo} isAdmin={isAdmin} hasPromos={promos.length > 0} />
          ))
        ) : (
          <div className="no-promos">No hay promociones disponibles</div>
        )}
      </div>
      {(estaEnModoAdmin() || estaEnModoEmple()) &&
        <div className="admin-buttons">
          {promos.length > 0 && <button className="promocion-button">Eliminar Promoción</button>}
          <button className="promocion-button" onClick={handleCrearPromocion}>Subir Promoción</button>
        </div>
      }
    </main>
  );
}

export default Promociones;
