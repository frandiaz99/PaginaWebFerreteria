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
    const tipos={
        'noti1': 'quiere intercambiarte un artículo.',
        'noti2': 'aceptó tu artículo, tienen un trueque pendiente. Revisá tu mail para ponerte en contacto.',
        'noti3': 'rechazó tu artículo.',
        'noti4': 'Se canceló el trueque que tenías pendiente.',
        'noti5': 'Tu artículo fue tasado, ya está disponible para realizar trueques.'
    }
    return (
        <div className='unaNotificacion'>
            <hr />
            {contenido.tipo !== 'noti4' && 
            <div className='fotoNotificacion'>
                <img src={contenido.foto} style={{width:'100%', height:'100%'}}/>
            </div>}

            {contenido.tipo !== 'noti4' && 
            <p>{contenido.nombre} {tipos[contenido.tipo]}</p>}

            {contenido.tipo === 'noti4' && <p>{tipos[contenido.tipo]}</p>}

            <button onClick={handleRedirect}>Ver</button>

        </div>
    )
}

export default UnaNotificacion