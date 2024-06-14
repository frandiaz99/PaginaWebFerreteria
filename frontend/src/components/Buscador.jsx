import React, { useState, useEffect } from 'react'
import '../styles/Buscador.css'
import { estaEnModoUser } from '../helpers/estaEnModo'

function Buscador({handleBuscar, textoBoton}) {

  const [contenidoBuscador, setContenidoBuscador]= useState('')
  

  const escribir= (e) =>{
    setContenidoBuscador(e.target.value)
  }


  const handleSubmit= (e) =>{
    e.preventDefault()
    handleBuscar(contenidoBuscador)
  }
  
  return (
    <form className='buscador' onSubmit={handleSubmit}>
      {estaEnModoUser()
      ?
        <input type="text" name='contenidoBuscador' placeholder='Articulo x' onChange={escribir}/>
      :
        <input type="number" name='contenidoBuscador' placeholder='DNI 22222222' onChange={escribir}/>
      }
      <input type="submit" value={textoBoton} className='boton-buscador'/>
    </form>
  )
}

export default Buscador