import React, { useEffect, useState } from 'react'
import '../styles/FiltroFecha.css'
import routes from '../routes'

function isDateBetween(dateToCheck, startDate, endDate) {
  const date = new Date(dateToCheck)
  const start= new Date(startDate)
  start.setDate(start.getDate() + 1)
  const end= new Date(endDate)
  end.setDate(end.getDate() + 1)

    // Normalizar las fechas al inicio del día (00:00:00)
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

  return date >= start && date <= end;
}

function FiltroFecha({totalItems, actualizar}) {

  const [fecha1, setFecha1]= useState(null)
  const [fecha2, setFecha2]= useState(null)
  const [sucursales, setSucursales]= useState(null)
  const [sucursalElegida, setSucursalElegida]= useState(null)

  const handleFecha1= (e) =>{
    setFecha1(e.target.value)
  }

  const handleFecha2= (e) =>{
    setFecha2(e.target.value)
  }

  const changeSucursal = (e) =>{
    setSucursalElegida(e.target.value)
  }

  useEffect(() =>{
    console.log(fecha1)
    console.log(new Date(fecha1))
    var itemsFiltrados= totalItems
    if (fecha1 && fecha2){
      itemsFiltrados= totalItems.filter(i => isDateBetween(i.fecha_venta, fecha1, fecha2))
      if (location.pathname !== routes.adminPrincipal) actualizar(itemsFiltrados)  //para el admin se actualiza luego de elegir una sucursal
    }
    if (sucursalElegida) {
      if (sucursalElegida !== 'default') itemsFiltrados= itemsFiltrados.filter(i => i.sucursal._id == sucursalElegida)
      actualizar(itemsFiltrados)
    }
  }, [fecha1,fecha2, sucursalElegida])

  useEffect(() => {  //obtener sucursales
    fetch("http://localhost:5000/sucursal/getSucursales", {
        method: "GET",
        headers: { "Content-Type": "application/JSON" },
        credentials: "include"
    })
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
        })
}, [])

  return (
    <div className='filtros-fecha'>
        <div className='div_filtro'>
            <label htmlFor="inputfilter1" className='label_filtro'>Desde</label>
            <input type="date" className='input_filtro' id='inputfilter1' onChange={handleFecha1}/>
        </div>

        <div className='div_filtro'>
            <label htmlFor="inputfilter2" className='label_filtro'>Hasta</label>
            <input type="date" className='input_filtro' id='inputfilter2' onChange={handleFecha2}/>
        </div>

        {location.pathname == routes.adminPrincipal && <div className='div_filtro'>
          <label htmlFor="sucursal">Sucursal</label>
          {sucursales && <select name="sucursal" id="sucursal" onChange={changeSucursal}>
            <option key={'todasLasSucursales'} value={'default'}>Todas las sucursales</option>
            {sucursales.map((s, index) => (<option key={s._id} value={s._id}>{s.nombre}</option>))}
          </select>}
        </div>}
    </div>
  )
}

export default FiltroFecha