import React from 'react'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import routes from './routes.js'
import PaginaPrincipal from './views/PaginaPrincipal.jsx'
import Header from './components/Header/Header.jsx'
import Sucursales from './views/Sucursales.jsx'
import ProtegerUser from './protegerRutas/ProtegerUser.jsx'
import ProtegerInvitado from './protegerRutas/ProtegerInvitado.jsx'
import ProtegerSucursales from './protegerRutas/ProtegerSucursales.jsx'
import ProtegerSucursalesLogin from './protegerRutas/ProtegerSucursalesLogin.jsx'
import ProtegerEmpleado from './protegerRutas/ProtegerEmpleado.jsx'
import ProtegerAdmin from './protegerRutas/ProtegerAdmin.jsx'
import RutasEmpleado from './protegerRutas/RutasEmpleado.jsx'
import RutasAdmin from './protegerRutas/RutasAdmin.jsx'
import RutasUser from './protegerRutas/RutasUser.jsx'
import RutasInvitado from './protegerRutas/RutasInvitado.jsx'

function App(){
  return (
    <BrowserRouter>
        <Routes>

            <Route path='/' element={
            <ProtegerInvitado>
                <Header/>
                <PaginaPrincipal/>
            </ProtegerInvitado>}/>


            <Route path='/invitado/*' element={
            <ProtegerInvitado>
                <RutasInvitado/>
            </ProtegerInvitado>
            }/>


            <Route path={routes.sucursales} element= {
            <ProtegerSucursales>
                <Header/>
                <Sucursales/>
            </ProtegerSucursales>}/>

            <Route path={routes.sucursalesLogin} element= {
            <ProtegerSucursalesLogin>
                <Header/>
                <Sucursales/>
            </ProtegerSucursalesLogin>}/>


            <Route path='/user/*' element={ 
            <ProtegerUser>
                <RutasUser/>
            </ProtegerUser>}/>
            
            <Route path='/empleado/*' element={
            <ProtegerEmpleado>
                <RutasEmpleado/>
            </ProtegerEmpleado>
            }/>

            <Route path='/admin/*' element={
            <ProtegerAdmin>
                <RutasAdmin/>
            </ProtegerAdmin>
            }/>

            <Route path='*' element={<div>404 not found</div>}/>

        </Routes>
    </BrowserRouter>
  )
}

export default App
