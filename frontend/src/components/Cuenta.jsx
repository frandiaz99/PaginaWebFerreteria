import React, { useState } from 'react'
import '../styles/Cuenta.css'
import Modal from './Modal'

function Cuenta({cuenta}) {
  const [confirmacion, setConfirmacion]= useState(false)

  const handleEliminar = () =>{
    setConfirmacion(false)      //esto se borraria, va dentro del fetch
    window.location.reload()
    /*fetch('http://localhost:5000/eliminarEmpleado',   //Esto iria cuando se cree el back
    {method: "POST", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al eliminar al empleado');
      }
      return response.json();
    })
    .then(data => {
      setConfirmacion(false)
      window.location.reload()
      //Informar que la eliminación fue exitosa
    })
    .catch(error => {
      console.error('Error:', error);
    });*/
  }

  const handleBoton= () => {
    setConfirmacion(true)
  }

  return (
    <div className='unaCuenta'>
      <div className='datosCuenta'>

        <div className='datosCuenta-foto'>
          <img src={cuenta.foto} alt="fotoCuenta" className='fotoDeCuenta'/>
        </div>

        <div className='datosCuenta-datos'>
          <h3>{cuenta.nombre}</h3>
          <h4>{cuenta.dni}</h4>
          <p>{cuenta.mail}</p>
          <p>Sucursal {cuenta.sucursal}</p>
        </div>

      </div>
      <div className='eliminarEmple'>
        <button className='boton-eliminarEmple' onClick={handleBoton}>Eliminar empleado</button>
      </div>

      <Modal texto={'¿Estás seguro que querés eliminar este empleado?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleEliminar} ok={false}/>
      
    </div>
  )
}

export default Cuenta