import React, { useState } from 'react'
import Buscador from '../components/Buscador'
import CrearCuenta from './CrearCuenta'
import Modal from '../components/Modal'

function RegistrarEmpleado() {
    const [empleado_es_usuario, setEmpleado_es_usuario]= useState(true)
    const [redireccionar, setRedireccionar]= useState(false)
    const [exitoso,setExitoso]= useState(false)
    const [dniValido, setDniValido]= useState(false)
    const [yaEsEmple, setYaEsEmple]= useState(false)
    const[modal, setModal]= useState(false)


    const handleBuscar= (dni) =>{
        localStorage.setItem('dniEmple', JSON.stringify(dni))
        fetch("http://localhost:5000/user/setEmpleado", {
                method: "POST",
                headers: { "Content-Type": "application/JSON"},
                body: JSON.stringify({dni: dni}),
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
                if (errorData.status == 404) {
                    localStorage.setItem('dniEmple', JSON.stringify(dni))
                    setModal(true)
                }
                else if (errorData.status == 401) setYaEsEmple(true)
                else console.log(errorData.message)
            });
    }

    const handleOk= () =>{
        setEmpleado_es_usuario(false)
        setRedireccionar(true)
        setModal(false)
    }
  
    if (empleado_es_usuario)
        return (
        <main className='main'>
            <div className='principal-registrarEmpleado'>
                <div className='titulo-registrarEmpleado'>
                    <h3>Registrar empleado</h3>
                    <p className='aclaracion-registrarEmpleado'>Si el empleado que vas a registrar ya tiene una cuenta el registro será automático</p>
                    <Modal texto={'El usuario ya es un empleado'} confirmacion={yaEsEmple} setConfirmacion={setYaEsEmple} ok={true}/>
                </div>
                <div>
                    <Buscador handleBuscar={handleBuscar} textoBoton={'Registrar'} dniValido={dniValido} setDniValido={setDniValido}/>
                    {(dniValido == false) && <p className="textoNoCumple">DNI inválido</p>}    
                </div>
                <Modal texto={'Registro exitoso'} confirmacion={exitoso} setConfirmacion={setExitoso} ok={true} />
                <Modal texto={'El DNI no está vinculado a una cuenta de usuario'} confirmacion={modal} setConfirmacion={setModal} handleYes={handleOk} ok={true} />
            </div>
        </main>
    )
    else return (
            <>
            {redireccionar && <CrearCuenta/>}
            </>
        )
}

export default RegistrarEmpleado