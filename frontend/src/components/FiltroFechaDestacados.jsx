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

//chequear que la fecha hasta no pueda ser menor que la fecha desde, y viceveresa.

function FiltroFechaDestacados({totalItems, actualizar}) {

  const [fecha1, setFecha1]= useState(null)
  const [fecha2, setFecha2]= useState(null)
  const obtenerFechaActual = () => {
    const hoy = new Date();
  
    const anio = hoy.getFullYear();
    let mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11, por eso se suma 1 y se asegura de que tenga dos dígitos
    let dia = hoy.getDate().toString().padStart(2, '0'); // Se asegura de que el día tenga dos dígitos
  
    return `${anio}-${mes}-${dia}`;
  };
  var fechaActual = obtenerFechaActual()

  const handleFecha1= (e) =>{
    setFecha1(e.target.value)
  }

  const handleFecha2= (e) =>{
    setFecha2(e.target.value)
  }

  useEffect(() =>{
    var itemsFiltrados= totalItems

    if (fecha1 && fecha2){
      if ((fecha1 < fecha2 || fecha1 == fecha2) && (fecha1 <= fechaActual || fecha2 <= fechaActual)){
        itemsFiltrados= totalItems.filter(i => isDateBetween(i.promocionado.fecha, fecha1, fecha2))
        if (location.pathname !== routes.adminPrincipal) {
          actualizar(itemsFiltrados)  //para el admin se actualiza luego de elegir una sucursal
        }
      }
    }
  }, [fecha1, fecha2])

  return (
    <div className='filtros-fecha'>
      <div className='container-filtro'>
        <div className='div_filtro'>
            <label htmlFor="inputfilter1" className='label_filtro'>Desde</label>
            <input type="date" value={fecha1 || ''} className='input_filtro' id='inputfilter1' onChange={handleFecha1}/>
        </div>
        <div className='div_filtro'>
            <label htmlFor="inputfilter2" className='label_filtro'>Hasta</label>
            <input type="date" value={fecha2 || ''} className='input_filtro' id='inputfilter2' onChange={handleFecha2}/>
        </div>
      </div>
      <div className='container-error'>
        {(fecha1 > fecha2 || fecha1 > fechaActual || fecha2 > fechaActual) && <span className='campoObligatorio'>El rango establecido es incorrecto.</span>}
      </div>
    </div>    
  )
}

export default FiltroFechaDestacados