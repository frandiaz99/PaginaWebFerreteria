import React, { useEffect, useState } from 'react'
import routes from '../routes.js'
import '../styles/Perfil.css'
import { Link } from 'react-router-dom';
import {estaEnModoAdmin, estaEnModoUser} from '../helpers/estaEnModo.js'
import Comentario from '../components/Comentario.jsx';
import { useId } from 'react';



function Perfil() {

  const [usuario, setUsuario] = useState();
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [comentarios, setComentarios]= useState([])
  const [comentariosObtenidos, setComentariosObtenidos]= useState(false)
  //const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (window.location.pathname === routes.perfilTercero) {
      const userTercero = JSON.parse(localStorage.getItem('userTercero'));
      setUsuario(userTercero)
      setIsOwnProfile(false)
      console.log('perfil tercero: ', userTercero)
    } else {
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
          console.log("usuariooo1234: ", data);
          setUsuario(data.User)
          setIsOwnProfile(true)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [location.pathname])
  

  useEffect(() => {
    if (usuario){

      fetch('http://localhost:5000/user/getValoraciones',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/JSON",
          }, 
          body: JSON.stringify({
            User: usuario
          }),
          credentials: "include"
        })
        .then(response => {
          if (!response.ok) {
             return response.json().then(data => {
                  throw new Error(JSON.stringify({message: data.message, status: data.status}));
              });
          }
          return response.json();
        })
        .then(data => {
          if (data.status == 200) setComentarios(data.Valoraciones)
          setComentariosObtenidos(true)
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
    }
  }, [usuario])

  function generarEstrellas(puntuacion) {
    console.log("a ver la puntuacion", puntuacion)
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
      {usuario ? (
        <div className='contendor-verPerfil'>
          <div className='contenedor-perfil'>
            <div className='col-img'>
              <img className='imagen' src={`http://localhost:5000/img/${usuario.foto_perfil}`} alt="Perfil"></img>
            </div>

            <div className='col-perfil'>
              <div className='fila-nombre'>{usuario.nombre} {usuario.apellido}</div>
              <div className='fila-email'>{usuario.email}</div>
              {usuario.sucursal ? (
                <div className='fila-email'>{usuario.sucursal.nombre}</div>
              ) : (
                usuario.rol < 3 && <div className='fila-email'>Sucursal: Selecciona una nueva sucursal</div>
              )}
              <div className='fila-nacimiento'>{getFecha(usuario.fecha_nacimiento)}</div>
              {!estaEnModoAdmin() && <div className='fila-puntos'>{generarEstrellas(usuario.valoracion)}</div>}
              {isOwnProfile && (
                <div className='fila-boton'>

                  {estaEnModoUser() ? (
                    <Link to={routes.editarPerfil} className='link'>
                      <button className='boton-editar-perfil'>Editar Perfil</button>
                    </Link>
                  ) : (
                    <Link to={routes.adminEditarPerfil} className='link'>
                      <button className='boton-editar-perfil'>Editar Perfil</button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {!estaEnModoAdmin() && <div className='contenedor-perfil-2'>
            <div className='cantidad-trueques'>
              Trueques realizados: - -
            </div>
            <div className="caja-comentarios" id='caja-comentarios'>
                {comentariosObtenidos
                ?
                  comentarios.length > 0
                  ?
                    comentarios.map((c, index) => (
                        <Comentario key={index} comentario={c} generarEstrellas={generarEstrellas}/>
                    ))  
                  :
                  <p>No hay comentarios</p>
                :
                    <p>Cargando...</p>
                }
            </div>
          </div>}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </main>
  );
}

export default Perfil