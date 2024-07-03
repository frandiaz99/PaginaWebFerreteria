import React from 'react'
import '../../styles/UnaNotificacion.css'
import {useNavigate } from 'react-router-dom'
import routes from '../../routes.js'



function UnaNotificacion({contenido}) {  //Despues ver si hay que llamar al back cada vez que se abra el drop o q onda
    const navigate = useNavigate();
    const handleRedirect = () => {
        if(contenido.tipo == 5){
            navigate(routes.misArticulos)
        }else{
            navigate(routes.misTrueques)
        }
    }
    return (
        <div className='unaNotificacion'>
            <div className='contenido-notificacion'>
                <p>{contenido.texto}</p>
            </div>
            <button onClick={handleRedirect} id='boton-ver'>Ver</button>
        </div>
    )
    //<img src={contenido.usuario.foto_perfil} id='foto-notificacion'/>
}

export default UnaNotificacion