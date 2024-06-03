import React from 'react'
import '../styles/FiltroFecha.css'

function FiltroFecha() {
  return (
    <div className='filtros-fecha'>
        <div className='div_filtro'>
            <label htmlFor="input_filtro" className='label_filtro'>Desde</label>
            <input type="date" className='input_filtro'/>
        </div>

        <div className='div_filtro'>
            <label htmlFor="input_filtro" className='label_filtro'>Hasta</label>
            <input type="date" className='input_filtro' />
        </div>
    </div>
  )
}

export default FiltroFecha