import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import '../styles/AdminEmpleados.css'
import Cuenta from '../components/Cuenta'
import Paginacion from '../components/Paginacion'
import Buscador from '../components/Buscador'
import routes from '../routes'

const cuentasXPag= 6 //en cada pagina mostrar x cuentas

function AdminEmpleados() {
  const navigate= useNavigate()
  const [totalCuentas, setTotalCuentas]= useState([])
  const [cuentasActuales,setCuentasActuales]= useState(totalCuentas)
  const [pagActual,setPagActual]= useState(1)
  const [eliminado, setEliminado]= useState(false)
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
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [])

  return (
    <main className='main'>
      <div className='main-empleados'>

        <div className='buscador-y-cuentasEmpleados'>
        {(cuentasActuales.length > 0) 
          ?
          <Buscador/>
          :
          <div className='buscador'> </div>
          }

          <div className='cuentasEmpleados' ref={cuentasRef}>
          {(totalCuentas.length == 0 || cuentasActuales.length == 0)
          ? 
            <div className='noHayItems'>
              No hay ningún empleado
            </div> //Podria ser un componente
          :
            mostrarCuentas().map((cuenta, index) =>(<Cuenta key={index} cuenta={cuenta}/>))
          }
          </div>
          {cuentasActuales.length > 0 &&  <Paginacion totalItems={totalCuentas.length} itemsXPag={cuentasXPag} onPageChange={handlePageChange} />}
        </div>

        <div className='registrarEmple'>
          <button className='boton-registrarEmple' onClick={() => navigate(routes.adminRegistrarEmpleado)}>Registrar Empleado</button>
        </div>
      </div>
    </main>
  )
}

export default AdminEmpleados