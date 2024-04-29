import React from 'react'
import '../../styles/UnaNotificacion.css'

function UnaNotificacion({contenido}) {  //Despues ver si hay que llamar al back cada vez que se abra el drop o q onda
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

            <button>Ver</button>

        </div>
    )
}

export default UnaNotificacion