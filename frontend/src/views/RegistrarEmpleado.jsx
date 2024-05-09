import React, { useState } from 'react'
import Buscador from '../components/Buscador'
import CrearCuenta from './CrearCuenta'
import Modal from '../components/Modal'

function RegistrarEmpleado() {
    const [empleado_es_usuario, setEmpleado_es_usuario]= useState(true)
    const [redireccionar, setRedireccionar]= useState(false)
    const [exitoso,setExitoso]= useState(false)

    const handleBuscar= (dni) =>{
        fetch("http://localhost:5000/user/setEmpleado", {
                method: "GET",
                headers: { "Content-Type": "application/JSON", 'dni': dni },
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                   return response.json().then(data => {
                        throw new Error(JSON.stringify({message: data.message, status: data.status}));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message)
                setExitoso(true)
            })
            .catch(error => {
                const errorData= JSON.parse(error.message)
                if (errorData.status == 405) setEmpleado_es_usuario(false)
                else console.log(errorData.message)
            });
    }

    const handleOk= () =>{
        setRedireccionar(true)
    }
  return (
    <main className='main'>
        {empleado_es_usuario ?
            <div className='principal-registrarEmpleado'>
                <Buscador handleBuscar={handleBuscar}/>
                {exitoso && <Modal texto={'Registro exitoso'} confirmacion={exitoso} setConfirmacion={setExitoso} ok={true} />}
            </div>
        :
            <>
            <Modal texto={'El DNI no está vinculado a una cuenta de usuari'} confirmacion={empleado_es_usuario} setConfirmacion={setEmpleado_es_usuario} handleYes={handleOk} ok={true} />
            {redireccionar && <CrearCuenta/>}
            </>
            }
    </main>
  )
}

export default RegistrarEmpleado