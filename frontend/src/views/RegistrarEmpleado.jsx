import React, { useState } from 'react'
import Buscador from '../components/Buscador'
import CrearCuenta from './CrearCuenta'
import Modal from '../components/Modal'

function RegistrarEmpleado() {
    const [empleado_es_usuario, setEmpleado_es_usuario]= useState(true)
    const [redireccionar, setRedireccionar]= useState(false)
    const [exitoso,setExitoso]= useState(false)
    const [dniValido, setDniValido]= useState(false)
    const[modal, setModal]= useState(false)


    const handleBuscar= (dni) =>{
        localStorage.setItem('dniEmple', JSON.stringify(dni))
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
                console.log("vamo a ver el message",data.message)
                setExitoso(true)
            })
            .catch(error => {
                const errorData= JSON.parse(error.message)
                if (errorData.status == 405) {
                    localStorage.setItem('dniEmple', JSON.stringify(dni))
                    setEmpleado_es_usuario(false)
                    setModal(true)
                }
                else console.log(errorData.message)
            });
    }

    const handleOk= () =>{
        setRedireccionar(true)
        setModal(false)
    }
  return (
    <main className='main'>
        {empleado_es_usuario ?
            <div className='principal-registrarEmpleado'>
                <div className='titulo-registrarEmpleado'>
                    <h3>Registrar empleado</h3>
                    <p className='aclaracion-registrarEmpleado'>Si el empleado que vas a registrar ya tiene una cuenta el registro será automático</p>
                </div>
                <div>
                    <Buscador handleBuscar={handleBuscar} textoBoton={'Registrar'} dniValido={dniValido} setDniValido={setDniValido}/>
                    {(dniValido == false) && <p className="textoNoCumple">DNI inválido</p>}    
                </div>
                {exitoso && <Modal texto={'Registro exitoso'} confirmacion={exitoso} setConfirmacion={setExitoso} ok={true} />}
            </div>
        :
            <>
            <Modal texto={'El DNI no está vinculado a una cuenta de usuario'} confirmacion={modal} setConfirmacion={setModal} handleYes={handleOk} ok={true} />
            {redireccionar && <CrearCuenta/>}
            </>
            }
    </main>
  )
}

export default RegistrarEmpleado