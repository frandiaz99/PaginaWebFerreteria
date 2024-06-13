import React, { useState, useEffect } from 'react'
import '../styles/Buscador.css'

function Buscador({handleBuscar, textoBoton}) {

  const [dni, setDni]= useState('')
  

  const handleDni= (e) =>{
    setDni(e.target.value)
  }


  const handleSubmit= (e) =>{
    e.preventDefault()
    handleBuscar(dni)
  }
  
  return (
    <form className='buscador' onSubmit={handleSubmit}>
      <input type="number" name='dni' placeholder='DNI 22222222' onChange={handleDni}/>
      <input type="submit" value={textoBoton} className='boton-buscador'/>
    </form>
  )
}

export default Buscador