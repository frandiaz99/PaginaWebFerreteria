import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import '../styles/AdminCuentas.css'
import Cuenta from '../components/Cuenta'
import Paginacion from '../components/Paginacion'
import Buscador from '../components/Buscador'
import routes from '../routes'

const cuentasXPag= 5 //en cada pagina mostrar x cuentas

function mostrarUsuarios(){
  return location.pathname === routes.adminUsuarios
}

function AdminCuentas() {
  const navigate= useNavigate()
  const [totalCuentas, setTotalCuentas]= useState([])
  const [cuentasActuales,setCuentasActuales]= useState(totalCuentas)
  const [pagActual,setPagActual]= useState(1)
  const [eliminado, setEliminado]= useState(false)
  const [obtenido, setObtenido]= useState(false)
  const cuentasRef= useRef(null)

  const handlePageChange= (pagina) =>{
    cuentasRef.current.scrollTop= 0 //Sube el scroll cuando cambias de pagina
    setPagActual(pagina)
  }

  function mostrarCuentas(){
    const ultimaCuenta= pagActual * cuentasXPag
    const primerCuenta= ultimaCuenta - cuentasXPag
    return cuentasActuales.slice(primerCuenta,ultimaCuenta)
  }

  useEffect(() =>{
    setCuentasActuales(totalCuentas)
  }, [totalCuentas]) //Solo cambia la primera vez

  useEffect(() => {
    //setObtenido(false)
    cuentasRef.current.style.display='none'
    if (mostrarUsuarios()){
      fetch('http://localhost:5000/user/getUsuarios',  
        {method: "GET", 
        headers: {
          "Content-Type": "application/JSON",
          //"Cookie": localStorage.getItem('jwt')
        },credentials: "include"})
        .then(response => {
          console.log("responseee",response)
          if (!response.ok) {
            throw new Error('Hubo un problema al obtener los empleados');
          }
          return response.json();
        })
        .then(data => {
          setTotalCuentas(data.Users)
          setObtenido(true)
          cuentasRef.current.style.display='block'
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }else{
        fetch('http://localhost:5000/user/getEmpleados',  
        {method: "GET", 
        headers: {
          "Content-Type": "application/JSON",
          //"Cookie": localStorage.getItem('jwt')
        },credentials: "include"})
        .then(response => {
          console.log("responseee",response)
          if (!response.ok) {
            throw new Error('Hubo un problema al obtener los empleados');
          }
          return response.json();
        })
        .then(data => {
          setTotalCuentas(data.Empleados)
          setObtenido(true)
          cuentasRef.current.style.display='block'
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [eliminado, location.pathname])

  const reiniciarCuentas= () =>{
    setEliminado(!eliminado)
  }

  return (
    <main className='main'>
      <div className='main-adminCuentas'>

        <div className='buscador-y-cuentasAdmin'>
        {(cuentasActuales.length > 0) 
          ?
          <Buscador/>
          :
          <div className='buscador'> </div>
          }

          <div className='cuentasAdmin' ref={cuentasRef}>
          {(totalCuentas.length == 0 || cuentasActuales.length == 0)
          ? 
            <div className='noHayItems'>
              {obtenido 
              ? 
                mostrarUsuarios() ? 'No hay ningún usuario' : 'No hay ningún empleado'
              : 'Cargando...'}
            </div> //Podria ser un componente
          :
            mostrarCuentas().map((cuenta, index) =>(<Cuenta key={index} cuenta={cuenta} eliminar={reiniciarCuentas}/>))
          }
          </div>
          {cuentasActuales.length > 0 &&  <Paginacion totalItems={totalCuentas.length} itemsXPag={cuentasXPag} onPageChange={handlePageChange} />}
        </div>

        <div className='registrarEmple'>
          {!mostrarUsuarios() && <button className='boton-registrarEmple' onClick={() => navigate(routes.adminRegistrarEmpleado)}>Registrar Empleado</button>}
        </div>
      </div>
    </main>
  )
}

export default AdminCuentas