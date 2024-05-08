import React from 'react'
import '../styles/Buscador.css'

function Buscador() {

  const handleBuscar= (e) =>{
    e.preventDefault()
  }
  
  return (
    <form className='buscador' onSubmit={handleBuscar}>
      <input type="number" placeholder='DNI 22222222'/>
      <input type="submit" value={'Buscar'}/>
    </form>
  )
}

export default Buscador