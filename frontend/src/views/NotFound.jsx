import React from 'react'
import { useNavigate } from 'react-router-dom'
import routes from '../routes'

function NotFound() {
    const navigate= useNavigate()
    const principal ={
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '80%'
    }
    const divImagen={
        height: '15rem',
        width: '15rem'
    }
    const imagen={
        width: '100%',
        height: '100%',
        cursor:'pointer'
    }
    const divTexto={
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent:'center'
    }
    const texto={
        width:'60%',
        display:'flex'
    }
  return (
    <div style={principal}>
        <div style={divImagen}>
            <img style={imagen} src="Fedeteria_Principal.png" alt="" onClick={() =>{navigate(routes.pagPrincipal)}} />
        </div>
        <div style={divTexto}>
            <p style={texto}>¡Ups! No pudimos encontrar la página que estás buscando.
                Por favor, verificá la URL e intentá de nuevo o dirigite a la página principal 
                para continuar navegando.
            </p>
        </div>
    </div>
  )
}

export default NotFound