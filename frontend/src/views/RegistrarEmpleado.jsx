import React, { useState } from 'react'
import Buscador from '../components/Buscador'
import CrearCuenta from './CrearCuenta'

function RegistrarEmpleado() {
    const [empleado_es_usuario, setEmpleado_es_usuario]= useState(true)

    const handlePrueba= () =>{
        setEmpleado_es_usuario(false)
    }
  return (
    <main className='main'>
        {empleado_es_usuario ?
            <div className='principal-registrarEmpleado'>
                <Buscador/>
                <button onClick={handlePrueba}>Prueba</button>
            </div>
        :
            <CrearCuenta/>}
    </main>
  )
}

export default RegistrarEmpleado