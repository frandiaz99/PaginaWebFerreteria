import React from 'react'
import '../styles/Comentario.css'

function Comentario({comentario, generarEstrellas}) {
    console.log("asdsa", comentario)

  return (
    <div className='caja_comentario'>
        <div className='usuarioComentando'>
            <div className='div_imagen_comentario'>
                <img className='imagen_comentario' src={`http://localhost:5000/img/${comentario.de_usuario.foto_perfil}`} alt="foto_user_comentando" />
            </div>
            <p>{comentario.de_usuario.nombre}</p>
        </div>

        <div className='contenido_comentario'>
            <p className='comment'>{comentario.opinion}</p>
            <p className='contenido_valoracion'>{generarEstrellas(comentario.valoracion)}</p>
        </div>
    </div>
  )
}

export default Comentario
