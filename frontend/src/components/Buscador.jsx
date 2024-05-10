import React, { useState, useEffect } from 'react'
import '../styles/Buscador.css'

function Buscador({handleBuscar, textoBoton, dniValido = () => false, setDniValido= () => console.log()}) {
  const [dni, setDni]= useState('')
  

  const handleDni= (e) =>{
    setDni(e.target.value)
  }

  useEffect(() => {  //Verificar DNI valido
    let dniCumple= false
    if (dni.length == 0) dniCumple=null
    else if (dni.length == 8) dniCumple= true
    setDniValido(dniCumple);
}, [dni])

  const handleSubmit= (e) =>{
    e.preventDefault()
    if (dniValido) handleBuscar(dni)
  }
  
  return (
    <form className='buscador' onSubmit={handleSubmit}>
      <input type="number" name='dni' placeholder='DNI 22222222' onChange={handleDni}/>
      <input type="submit" value={textoBoton}/>
    </form>
  )
}

export default Buscador