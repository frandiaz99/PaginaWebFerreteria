import React, { useState } from 'react'
import '../styles/Cuenta.css'

function Cuenta({cuenta, setEliminado, eliminado}) {
  const [confirmacion, setConfirmacion]= useState(false)

  const handleEliminar = () =>{
    setEliminado(!eliminado)
    setConfirmacion(false)
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
      setEliminado(!eliminado)
      setConfirmacion(false)
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

      {confirmacion && 
      <div className='confirmacionEliminarEmple'>
        <p>
          ¿Estás seguro que querés eliminar este empleado?
        </p>
        <div className='botonesConfirm'>
          <button onClick={handleEliminar} className='botonConfirm'>Si</button>
          <button onClick={() => {setConfirmacion(false)}} className='botonConfirm'>No</button>
        </div>
      </div>}
    </div>
  )
}

export default Cuenta