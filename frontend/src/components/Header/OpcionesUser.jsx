import React, { useState, useEffect, useRef } from 'react'
import '../../styles/OpcionesUser.css'
import { Link, useNavigate } from 'react-router-dom'
import routes from '../../routes'
import DropNotificaciones from './DropNotificaciones'
import { estaEnModoEmple, estaEnModoUser } from '../../helpers/estaEnModo'

function OpcionesUser() {
  const navigate = useNavigate()
  const [dropCuentaOpen, setDropCuentaOpen] = useState(false)
  const [dropNotificacionesOpen, setDropNotificacionesOpen] = useState(false)
  const dropNotificacionesRef = useRef(null)
  const dropCuentaRef = useRef(null)
  const [user, setUser] = useState(null)
  const [nuevaNoti, setNuevaNoti]= useState(false)
  const [srcFotoPerfil, setSrcFotoPerfil] = useState("http://localhost:5000/img/" + JSON.parse(localStorage.getItem('user')).foto_perfil)

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
          throw new Error('Hubo un problema al obtener el usuario');
        }
        return response.json();
      })
      .then(data => {
        console.log("usuarioooo: ", data);
        setSrcFotoPerfil("http://localhost:5000/img/" + data.User.foto_perfil)
        localStorage.setItem('user', JSON.stringify(data.User))
        setUser(data.User)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  useEffect(() =>{
          //obtener notificaciones nuevas
          fetch('http://localhost:5000/notificacion/getNotificaciones',
            {
              method: "GET",
              headers: {
                "Content-Type": "application/JSON",
              }, credentials: "include"
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Hubo un problema al obtener las notificaciones');
              }
              return response.json();
            })
            .then(data => {
              console.log(data)
              const nuevasNotis=data.filter(notis => !notis.visto)
              localStorage.setItem('notificaciones',JSON.stringify(nuevasNotis))
              if (nuevasNotis.length > 0) setNuevaNoti(true)
              else setNuevaNoti(false)
            })
            .catch(error => {
              console.error('Error:', error);
            });
  },[location.pathname])

  const handleHome = () => {
    if (estaEnModoUser()) {
      navigate(routes.userPrincipal)
    } else if (estaEnModoEmple() && user.rol == 2) {
      navigate(routes.empleadoPrincipal)
    } else {
      navigate(routes.adminPrincipal)
    }
  }

  const handleNotificaciones = () => {
    setDropNotificacionesOpen(!dropNotificacionesOpen)
  }

  const handleCuenta = () => {
    setDropCuentaOpen(!dropCuentaOpen)
  }

  const handleClickOutsideCuenta = (event) => {
    if (dropCuentaRef.current && !dropCuentaRef.current.contains(event.target)) {
      setDropCuentaOpen(false);
    }
  }

  const handleClickOutsideNotificaciones = (event) => {
    if (dropNotificacionesRef.current && !dropNotificacionesRef.current.contains(event.target)) {
      setDropNotificacionesOpen(false);
    }
  }

  const cambiarAUsuario = () => {
    localStorage.setItem('cuentaActual', 'usuario')
    navigate(routes.userPrincipal)
  }

  const cambiarAEmpleado = () => {
    localStorage.setItem('cuentaActual', 'empleado')
    navigate(routes.empleadoPrincipal)
  }

  useEffect(() => { //Cerrar menu de cuenta al tocar fuera
    // Agrega el listener cuando el menú está abierto
    if (dropCuentaOpen) {
      document.addEventListener('mousedown', handleClickOutsideCuenta);
    }

    // Cleanup que remueve el listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideCuenta);
    };
  }, [dropCuentaOpen]);

  useEffect(() => {   //Cerrar menu de notificaciones al tocar fuera
    // Agrega el listener cuando el menú está abierto
    if (dropNotificacionesOpen) {
      document.addEventListener('mousedown', handleClickOutsideNotificaciones);
    }

    // Cleanup que remueve el listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificaciones);
    };
  }, [dropNotificacionesOpen]);

  const handleCerrarSesion = () => {
    localStorage.clear();
    fetch('http://localhost:5000/user/logout', {
      method: "POST",
      credentials: "include"
    })
      .then(response => {
        if (response.ok) {
          console.log('La sesión se cerró correctamente');
          navigate(routes.pagPrincipal);
        } else {
          throw new Error('Hubo un problema al cerrar sesión');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const irAPerfil = () => {
    setDropCuentaOpen(false)
    if (estaEnModoUser()) navigate(routes.perfil)
    else navigate(routes.adminPerfil)
  }

  return (
    <div className='opcionesUser'>

      <div className='volver' onClick={handleHome}>
        <ion-icon name="home-outline" size='small'></ion-icon>
      </div>

      {estaEnModoUser() &&
        <div className='containersDrop' id='containerNotificaciones' ref={dropNotificacionesRef} onClick={handleNotificaciones}>

          <div className='notificaciones'>
            <ion-icon name={nuevaNoti ? "chatbubbles" :"chatbubbles-outline"} size='small'></ion-icon>
          </div>

          {dropNotificacionesOpen && <DropNotificaciones setNuevaNoti={setNuevaNoti}/>}

        </div>
      }

        <div className='containersDrop' ref={dropCuentaRef}>
          <div className='cuenta' onClick={handleCuenta}>
            {srcFotoPerfil && <img src={srcFotoPerfil} alt="" className='fotoCuenta' />}
          </div>

        {(dropCuentaOpen && user) &&
          <div className='dropCuenta'>
            <div className='dropCuenta__mail'>

                <div className='cuenta'>
                  {srcFotoPerfil && <img src={srcFotoPerfil} alt="" className='fotoCuenta' />}
                </div>

              <div className='nombre_y_email'>
                <span>{user.nombre}</span>
                <p style={{ fontSize: '10px', color: '#5A5D6C' }}>{user.email}</p>
              </div>

            </div>

            <hr />

            {(estaEnModoUser() || user.rol == 3) && <div className='dropCuenta__items' onClick={irAPerfil}>
              <ion-icon name="person-outline"></ion-icon>
              <p>Ver perfil</p>
            </div>}

            {(estaEnModoUser() && user.rol === 2) &&
              <div className='dropCuenta__items' onClick={cambiarAEmpleado}>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Empleado</p>
              </div>}

            {(estaEnModoEmple() && user.rol === 2) &&
              <div className='dropCuenta__items' onClick={cambiarAUsuario}>
                <ion-icon name="key-outline"></ion-icon>
                <p>Cuenta Usuario</p>
              </div>}

            <hr />

            <div className='dropCuenta__items' onClick={handleCerrarSesion}>
              <ion-icon name="log-out-outline"></ion-icon>
              <p>Cerrar sesión</p>
            </div>

          </div>}

      </div>
    </div>
  )
}

export default OpcionesUser