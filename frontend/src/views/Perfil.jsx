import React, { useEffect, useState } from 'react'
import routes from '../routes.js'
import '../styles/Perfil.css'
import { Link } from 'react-router-dom';

const estaEnModoUser = () => {
  return (
    location.pathname.startsWith('/user')
  )
}

function Perfil() {

  const [usuario, setUsuario] = useState();
  //const user = JSON.parse(localStorage.getItem('user'));

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
        console.log("usuarioooo: ", data);
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

  function getFecha(fechaOriginal) {

    var fecha = new Date(fechaOriginal)

    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
    var anio = fecha.getFullYear();

    // Formatear la fecha en el formato deseado (DD.MM.YYYY)
    var fechaFormateada = dia.toString().padStart(2, '0') + '-' + mes.toString().padStart(2, '0') + '-' + anio;

    return fechaFormateada;

  }


  return (
    <main className='main'>

      <div className='contendor-verPerfil'>

        <div className='contenedor-perfil'>

          <div className='col-img'>
            <img className='imagen' src={usuario && `http://localhost:5000/img/${usuario.foto_perfil}`}></img>
          </div>

          <div className='col-perfil'>
            {usuario && (
              <>
                <div className='fila-nombre'>{usuario.nombre} {usuario.apellido}</div>
                <div className='fila-email' >{usuario.email}</div>
                {usuario.sucursal ? <div className='fila-email' >{usuario.sucursal.nombre}</div>
                  : usuario.rol < 3 ?
                  <div className='fila-email' >Sucursal: Selecciona una nueva sucursal</div>
                  :
                    <div></div> /*para que no aparezca sucursal si es admin*/} 
                <div className='fila-nacimiento'>{getFecha(usuario.fecha_nacimiento)}</div>
                <div className='fila-puntos'>{generarEstrellas(usuario.puntos)}</div>
                <div className='fila-boton'>
                  {estaEnModoUser() ? (
                    <Link to={routes.editarPerfil} className='link' ><button className='boton-editar-perfil'>Editar Perfil</button></Link>
                  ) : (
                    <Link to={routes.adminEditarPerfil} className='link'><button className='boton-editar-perfil'>Editar Perfil</button></Link>
                  )}
                </div>
              </>
            )}
          </div>

        </div>

        <div className='contenedor-perfil-2'>
          <div className='cantidad-trueques'>
          {estaEnModoUser() && 'Trueques realizados: - -'}
          </div>
        </div>
      </div>
    </main >
  )
}

export default Perfil