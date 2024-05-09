import React, { useState } from 'react'
import '../styles/Buscador.css'

function Buscador({handleBuscar}) {

  const handleSubmit= (e) =>{
    e.preventDefault()
    const dni = e.target.elements.dni.value;
    handleBuscar(dni)
  }
  
  return (
    <form className='buscador' onSubmit={handleSubmit}>
      <input type="number" name='dni' placeholder='DNI 22222222'/>
      <input type="submit" value={'Buscar'}/>
    </form>
  )
}

export default Buscador