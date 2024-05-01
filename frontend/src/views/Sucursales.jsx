import React, { useState, useEffect } from 'react'
import '../styles/Sucursal.css';
import json_sucursal from '../data/sucursales.json';  
import Sucursal from '../components/Sucursal'; 

function Sucursales() {

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    setSucursales(json_sucursal)
  }, [])

  return (
    <main className='main'>
      <div className='body-sucursales'>
        {sucursales.map((sucursal, index) => (
          <Sucursal key={index} sucursal={sucursal} />
        ))}
      </div>

    </main>
  )
}

export default Sucursales