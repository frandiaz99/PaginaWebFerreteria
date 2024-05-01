import React, { useEffect, useState } from 'react'



function Perfil() {

  const [usuario, setUsuario] = useState();

  useEffect (() => {
    fetch('http://localhost:5000/user/getSelf', 
    {method: "GET", 
    headers: {
      "Content-Type": "application/JSON",
    },credentials: "include"})
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

  return (
    <main className='main'>
      <div>Perfil</div>

      <div className="imagen">
        {usuario && usuario.foto_perfil && (
          <img src={`http://localhost:5000/img/${usuario.foto_perfil}`} alt='Foto Perfil'/>
        )}
      </div>


    </main>
  )
}

export default Perfil