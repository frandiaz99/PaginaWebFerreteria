import React, { useEffect, useState } from 'react'
import routes from '../routes.js'
import '../styles/Perfil.css'
import { Link } from 'react-router-dom';

function Perfil() {

  const [usuario, setUsuario] = useState();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:5000/user/getSelf',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
        }, credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los articulos');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setUsuario(data.User)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  function generarEstrellas(puntuacion) {
    const estrellas = [];

    const estrellasCompletas = Math.floor(puntuacion);
    const hayMediaEstrella = puntuacion - estrellasCompletas >= 0.5;
    const estrellasVacias = 5 - estrellasCompletas - (hayMediaEstrella ? 1 : 0);

    for (let i = 0; i < estrellasCompletas; i++) {
      estrellas.push(<ion-icon name="star"></ion-icon>);
    }

    if (hayMediaEstrella) {
      estrellas.push(<ion-icon name="star-half"></ion-icon>);
    }

    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<ion-icon name="star-outline"></ion-icon>);
    }

    return estrellas;
  }


  return (
    <main className='main'>

      <div className='contendor-verPerfil'>

        <div className='contenedor-perfil'>

          <div className='col-img'>
            <img className='imagen' src={`http://localhost:5000/img/${user.foto_perfil}`}></img>
          </div>

          <div className='col-perfil'>
            <div className='fila-nombre'>{user.nombre} {user.apellido}</div>
            <div className='fila-email' >{user.email}</div>
            <div className='fila-puntos'>{generarEstrellas(user.puntos)}</div>
            <div className='fila-boton'>
              <Link to={routes.editarPerfil} className='link' ><button className='boton-editar-perfil'>Editar Perfil</button></Link>
            </div>
          </div>
        </div>

        <div className='contenedor-perfil-2'>
          <div className='cantidad-trueques'>
            Trueques realizados: - -
          </div>
          <div className='contenedor-comentarios'>
            <h2>Comentarios</h2>
            <div className="caja-comentarios">
              comentario 
            </div>
          </div>

        </div>
      </div>
    </main >
  )
}

export default Perfil