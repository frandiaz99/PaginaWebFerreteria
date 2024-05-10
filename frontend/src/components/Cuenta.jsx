import React, { useState } from 'react'
import '../styles/Cuenta.css'
import Modal from './Modal'

function Cuenta({cuenta}) {
  const [confirmacion, setConfirmacion]= useState(false)
  const [eliminacionExitosa, setEliminacionExitosa]= useState(false)
  const srcFotoPerfil= ("http://localhost:5000/img/" + cuenta.foto_perfil);

  const handleEliminar = () =>{
    setConfirmacion(false)
    fetch('http://localhost:5000/user/deleteUser',   
    {method: "DELETE", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },
    body: JSON.stringify({id: cuenta._id}),
    credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al eliminar al empleado');
      }
      return response.json();
    })
    .then(data => {
      setEliminacionExitosa(true)
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  const handleEliminacionExitosa= () =>{
    window.location.reload()
  }

  const handleBoton= () => {
    setConfirmacion(true)
  }

  return (
    <div className='unaCuenta'>
      <div className='datosCuenta'>

        <div className='datosCuenta-foto'>
          <img src={srcFotoPerfil} alt="fotoCuenta" className='fotoDeCuenta'/>
        </div>

        <div className='datosCuenta-datos'>
          <h3>{cuenta.nombre}</h3>
          <h4>{cuenta.dni}</h4>
          <p>{cuenta.mail}</p>
          <p>Sucursal: {cuenta.sucursal.nombre}</p>
        </div>

      </div>
      <div className='eliminarEmple'>
        <button className='boton-eliminarEmple' onClick={handleBoton}>Eliminar empleado</button>
      </div>

      <Modal texto={'¿Estás seguro que querés eliminar este empleado?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleEliminar} ok={false}/>
      <Modal texto={'Eliminación exitosa'} confirmacion={eliminacionExitosa} setConfirmacion={setEliminacionExitosa} handleYes={handleEliminacionExitosa} ok={true} />
    </div>
  )
}

export default Cuenta