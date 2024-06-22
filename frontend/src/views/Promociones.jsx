// src/components/Promociones.jsx
import React, { useState, useEffect } from 'react';
import Promocion from '../components/Promocion';
import '../styles/Promociones.css';
import { estaEnModoAdmin, estaEnModoEmple } from '../helpers/estaEnModo';
import routes from '../routes';
import { useNavigate } from 'react-router-dom';

function Promociones({ isAdmin }) {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [promosPendientes, setPromosPendientes] = useState([]);
  const [obtenido, setObtenido] = useState(false);
  const [subirPromocion, setSubirPromocion] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/promocion/getPromociones', {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
      },
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
        setPromos(data);
        setObtenido(true);
      })
      .catch(error => {
        const errorData = JSON.parse(error.message);
        console.log(errorData.message);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/promocion/getPromocionesPendientes', {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
      },
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
        if (estaEnModoAdmin()) {
          setPromosPendientes(data);
        }
        setObtenido(true);
      })
      .catch(error => {
        const errorData = JSON.parse(error.message);
        console.log(errorData.message);
      });
  }, []);

  const handleCrearPromocion = () => {
    navigate(routes.crearPromocion);
  };

  return (
    <main className="main">
      <div className='promociones'>
        <div className='promociones-disponibles'>
          <div className='cartel-promociones'>
            <p>Promociones disponibles</p>
          </div>
          <div className="promociones-container">

            {promos.length > 0 ? (
              promos.map(promo => (
                <Promocion key={promo._id} promo={promo} isAdmin={isAdmin} hasPromos={promos.length > 0} />
              ))
            ) : (
              <div className="no-promos">No hay promociones disponibles</div>
            )}
          </div>
        </div>
        <></>
        <div className='promociones-disponibles'>
          <div className='cartel-promociones'>
            <p>Promociones pendientes</p>
          </div>
          <div className="promosPendientes">

            {promosPendientes.length > 0 ? (
              promosPendientes.map(promo => (
                <Promocion key={promo._id} promo={promo} isAdmin={isAdmin} hasPromos={promosPendientes.length > 0} />
              ))
            ) : (
              estaEnModoAdmin() && <div className="no-promos">No hay promociones pendientes disponibles</div>
            )}
          </div>

        </div>
      </div>
      {(estaEnModoAdmin() || estaEnModoEmple()) && (
        <div className="admin-buttons">
          <button className="promocion-button" onClick={handleCrearPromocion}>Subir Promoción</button>
        </div>
      )}
    </main>
  );
}

export default Promociones;
