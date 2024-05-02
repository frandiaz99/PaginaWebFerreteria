import React, { useEffect, useState } from 'react'

import '../styles/Perfil.css'
import 'bootstrap/dist/css/bootstrap.min.css';

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
          throw new Error('Hubo un problema al obtener el perfil');
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

  return (
    <main className='main'>
      <div class="container custom-container">
        <div class="row">
          <div class="col-md-4">
            <img src={`http://localhost:5000/img/${user.foto_perfil}`}></img>
          </div>
          <div class="col-md-4">
            <p className='user-nombre'>{user.nombre}</p>
            <p className='user-email'>{user.email}</p>
            <p className='user-puntos'>{user.puntos}</p>
          </div>
          <div class="col-md-4">
            <button className='editar-perfil'>Editar Perfil</button>
          </div>
        </div>
      </div>

      <div className='perfil-comentarios-body'>
        <p>cantidad de trueques</p>
        <div>
          caja comentarios
        </div>
      </div>
    </main>
  )

}

export default Perfil