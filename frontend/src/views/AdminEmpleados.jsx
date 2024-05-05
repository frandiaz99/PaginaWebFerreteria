import React from 'react'
import { useState, useEffect, useRef } from 'react'
import '../styles/AdminEmpleados.css'
import Cuenta from '../components/Cuenta'
import Paginacion from '../components/Paginacion'
import empleados from '../data/empleados.json' //temporal hasta obtenerlo del back

const cuentasXPag= 6 //en cada pagina mostrar x cuentas

function AdminEmpleados() {
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
    /*fetch('http://localhost:5000/CuentasDeEmpleadosss',   //Esto iria cuando se cree el back
    {method: "GET", 
    headers: {
      "Content-Type": "application/JSON",
      //"Cookie": localStorage.getItem('jwt')
    },credentials: "include"})
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los empleados');
      }
      return response.json();
    })
    .then(data => {
      setTotalCuentas(data)
    })
    .catch(error => {
      console.error('Error:', error);
    });*/
    setTotalCuentas(empleados) //temporal hasta obtenerlo del back
  }, [])

  return (
    <main className='main'>
      <div className='main-empleados'>

        <div className='buscador-y-registrar'>
        {(cuentasActuales.length > 0) 
          ?
          <div className='buscador'>
            Aca iria el buscador
          </div>
          :
          <div className='buscador'> </div>}

          <div className='registrarEmple'>
            <button className='boton-registrarEmple'>Registrar Empleado</button>
          </div>
        </div>

        <div className='cuentasEmpleados' ref={cuentasRef}>
          {(totalCuentas.length == 0 || cuentasActuales == 0)
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
    </main>
  )
}

export default AdminEmpleados