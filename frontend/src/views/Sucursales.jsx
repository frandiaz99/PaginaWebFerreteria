import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Sucursal.css';  
import Sucursal from '../components/Sucursal'; 
import routes from '../routes';

const estaEnModoAdmin= () =>{
  return (
    location.pathname.startsWith('/admin')
    )
}

function Sucursales() {
  const navigate= useNavigate()
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/sucursal/getSucursales', 
    {method: "GET", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al obtener las sucursales');
      }
      return response.json();
    })
    .then(data => {
      setSucursales(data.Sucursales)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [])

  const handleSubirSucursal= () =>{
    navigate(routes.adminSubirSucursal)
  }

  return (
    <main className='main'>
      <div className='principal-sucursales'>
        {estaEnModoAdmin() && 
          <div className='agregarSucursal'>
              <button className='boton_subirSucursal' onClick={handleSubirSucursal}>Agregar</button>
          </div>
        } 
        <div className='body-sucursales'>
          {sucursales.map((sucursal, index) => (
            <Sucursal key={index} sucursal={sucursal} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Sucursales