import React, { useEffect, useState } from 'react'
import routes from '../routes.js'
import '../styles/Perfil.css'
import { Link } from 'react-router-dom';
import {estaEnModoAdmin, estaEnModoUser} from '../helpers/estaEnModo.js'



function Perfil() {

  const [usuario, setUsuario] = useState();
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  var userValoraciones;
  var hecho = false;
  //const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (window.location.pathname === routes.perfilTercero) {
      const userTercero = JSON.parse(localStorage.getItem('userTercero'));
      userValoraciones = userTercero;
      setUsuario(userTercero)
      console.log("USUARIOOOOOO SELF EN IF: "+usuario);
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
          userValoraciones = data.User;
          console.log("USUARIOOOOOO SELF: "+data.User);
          setIsOwnProfile(true)
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [location.pathname])

  useEffect(() => {
    var caja_comentarios = document.getElementById("caja-comentarios");
    if (!hecho){
      console.log("no esta hecho: "+hecho)
      hecho = true;
      setTimeout(function (){
        caja_comentarios.innerHTML = "cargando...";
        fetch('http://localhost:5000/user/getValoraciones',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/JSON",
          }, 
          body: JSON.stringify({
            User: userValoraciones
          }),
          credentials: "include"
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al obtener los comentarios');
          }
          return response.json();
        })
        .then(data => {
          caja_comentarios.innerHTML = "";
          console.log("data valoraciones: ", data);
          data.Valoraciones.forEach(valoracionData => {
            const seccion_nombre = document.createElement('div');
            const seccion_estrellas = document.createElement('div');
            const seccion_comentario = document.createElement('div');
            seccion_nombre.id = "seccion-nombre";
            seccion_estrellas.id = "seccion-estrella";
            seccion_comentario.id = "seccion-comentario";
            seccion_nombre.innerHTML = "<b>"+valoracionData.de_usuario.nombre + " " + valoracionData.de_usuario.apellido+"<b>";
            seccion_estrellas.innerHTML = valoracionData.valoracion;
            seccion_comentario.innerHTML = '"'+valoracionData.opinion+'"';
            console.log("seccion nombre: "+ seccion_nombre.textContent)
            console.log("seccion estre: "+ seccion_estrellas.textContent)
            console.log("seccion coment: "+ seccion_comentario.textContent)
            caja_comentarios.appendChild(seccion_nombre);
            caja_comentarios.appendChild(seccion_estrellas);
            caja_comentarios.appendChild(seccion_comentario);
          })
        })
        .catch(error => {
          caja_comentarios.innerHTML = ""
          const titulo = document.createElement('p');
          const msj_sin_comentarios = document.createElement('p');
          titulo.id = "titulo-valoraciones"
          titulo.innerText = "Valoraciones";
          msj_sin_comentarios.id = "msj-sin-comentarios";
          msj_sin_comentarios.innerText = "A este usuario aún no le han hecho valoraciones.";
          caja_comentarios.appendChild(titulo);
          caja_comentarios.appendChild(msj_sin_comentarios);
          console.error('Error:', error);
        });
      }, 500);
    }else{
      console.log("esta hecho: "+hecho)
    }
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