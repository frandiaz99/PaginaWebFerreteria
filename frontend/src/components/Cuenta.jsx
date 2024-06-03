import React, { useEffect, useState } from 'react'
import '../styles/Cuenta.css'
import Modal from './Modal'
import routes from '../routes'

function mostrarUsuarios(){
  return location.pathname === routes.adminUsuarios
}

function Cuenta({cuenta, eliminar}) {
  const [eliminarEmple, setEliminarEmple]= useState(false)
  const [bloqueado, setBloqueado]= useState(false)
  const [bloquearUser, setBloquearUser]= useState(false)
  const [desbloquearUser, setDesbloquearUser]= useState(false)
  const srcFotoPerfil= ("http://localhost:5000/img/" + cuenta.foto_perfil);

  const handleEliminar = () =>{
    setEliminarEmple(false)
    fetch('http://localhost:5000/user/deleteEmpleado',   
    {method: "POST", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },
    body: JSON.stringify({_id: cuenta._id}),
    credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al eliminar al empleado');
      }
      return response.json();
    })
    .then(data => {
      eliminar()
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }


  const handleBotonEliminar= () => {
    setEliminarEmple(true)
  }

  const handleBotonBloquear= () => {
    setBloquearUser(true)
  }

  const handleBotonDesbloquear= () => {
    setDesbloquearUser(true)
  }

  const handleBloquear= () =>{
    setBloquearUser(false)
    fetch('http://localhost:5000/user/bloquearUser',   
    {method: "POST", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },
    body: JSON.stringify({_id: cuenta._id}),
    credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al bloquear al usuario');
      }
      return response.json();
    })
    .then(data => {
      setBloqueado(true)
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  const handleDesbloquear= () =>{
    setDesbloquearUser(false)
    fetch('http://localhost:5000/user/desbloquearUser',   
    {method: "POST", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },
    body: JSON.stringify({User: cuenta}),
    credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al desbloquear al usuario');
      }
      return response.json();
    })
    .then(data => {
      setBloqueado(false)
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  useEffect(() =>{
    if (cuenta.intento_desbloqueo == 3) setBloqueado(true)
  },[])

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
      <div className='div-botonCuenta'>
        {mostrarUsuarios() 
        ?
          bloqueado
          ?
            <button className='botonCuenta' onClick={handleBotonDesbloquear}>Desbloquear</button>
          :
            <button className='botonCuenta' onClick={handleBotonBloquear}>Bloquear</button>
        :
          <button className='botonCuenta' onClick={handleBotonEliminar}>Eliminar empleado</button>}
      </div>

      <Modal texto={'¿Estás seguro que querés eliminar este empleado?'} confirmacion={eliminarEmple} setConfirmacion={setEliminarEmple} handleYes={handleEliminar} ok={false}/>
      <Modal texto={'¿Estás seguro que querés bloquear este usuario?'} confirmacion={bloquearUser} setConfirmacion={setBloquearUser} handleYes={handleBloquear} ok={false}/>
      <Modal texto={'¿Estás seguro que querés desbloquear este usuario?'} confirmacion={desbloquearUser} setConfirmacion={setDesbloquearUser} handleYes={handleDesbloquear} ok={false}/>
    </div>
  )
}

export default Cuenta