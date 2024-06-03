import React, { useState, useEffect } from 'react'
import '../styles/CambiarContrasenia.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import routes from "../routes";

function CambiarContrasenia() {
  const [coincidenContrasenias, setCoincidenContrasenias] = useState(false) //si las 2 nuevas contraseñas coinciden
  const [cumpleContrasenia, setCumpleContrasenia] = useState(false)
  const [contDistintaAVieja, setContDistintaAVieja] = useState(false)

  const [contraIncorrecta, setContraIncorrecta]= useState(false) //Modal contraseña incorrecta actual
  const [cambiarContrasenia, setCambiarContrasenia] = useState(false) //Modal cambio exitoso
  const [datos, setDatos] = useState(
    {
      password: '',
      newPassword: '',
      newPasswordRepeat: ''
    }
  )
  var user= JSON.parse(localStorage.getItem('user'))

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }


  const verificarContrasenias = (contrasenia, repetirContrasenia) => {
    if (contrasenia === '' && repetirContrasenia === '') return null
    return contrasenia === repetirContrasenia;
  }

  const verificarCondicionContrasenia = (contrasenia) => {
    if (contrasenia === '') {
      return null
    }
    const tieneMinimoCaracteres = contrasenia.length >= 6;
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(contrasenia);
    const tieneMayuscula = /[A-Z]+/.test(contrasenia);

    return tieneMinimoCaracteres && tieneCaracterEspecial && tieneMayuscula;
  }

  const verificaDistinta = (anteriorContrasenia,nuevaContrasenia) => {
    if (nuevaContrasenia === '') return null
    return nuevaContrasenia !== anteriorContrasenia
  }

  const handleCambiarContrasenia = (event) => {
    event.preventDefault();
    if (coincidenContrasenias && cumpleContrasenia && contDistintaAVieja){

      fetch("http://localhost:5000/user/cambiarContrasena", {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ User: datos }),
        credentials: "include"
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(JSON.stringify({ message: data.message, status: data.status }));
            });
          }
          return response.json();
        })
        .then(data => {
          setCambiarContrasenia(true)
          console.log('Respuesta del servidor al editar perfil:', data);
        })
        .catch(error => {
          const errorData = JSON.parse(error.message)
          //console.error('Hubo un problema al guardar los cambios:', error);
          switch (errorData.status) {
            case 407:
              setCumpleContrasenia(false)
              console.log("contraseña nueva no cumple condicion -> ", cumpleContrasenia)
              break
            case 408:
              setContraIncorrecta(true)
              console.log("contraseña vieja incorrecta -> ")
              break;
            default:
              console.log(errorData.message)
          }
        });
    }

  };


  const handleOk = () => {
    setCambiarContrasenia(false)
    if (user.rol == 3) window.location.href = routes.adminPerfil
    else window.location.href = routes.perfil
  };

  useEffect(() => {  //Verificar que coincidan las contraseñas y que cumpla los requisitos de contraseña   
    setCoincidenContrasenias(verificarContrasenias(datos.newPassword, datos.newPasswordRepeat))
    setCumpleContrasenia(verificarCondicionContrasenia(datos.newPassword))
    setContDistintaAVieja(verificaDistinta(datos.newPassword, datos.password))
  }, [datos.newPassword, datos.newPasswordRepeat, datos.password])


  return (
    <main className='main'>
      <div class="container">
        <h2>Cambiar Contraseña</h2>
        <div className='div-form'>
          <div class="form-group">
            <label for="contrasena-anterior">Contraseña actual:</label>
            {/*<input type="password" id="contrasena-anterior" className="contrasena-anterior" required /> */}
            <input type="password" id="contrasena-anterior" className="passwordCambiarContrasenia" name='password' required onChange={handleChange} />
          </div>
          <div class="form-group">
            <label for="nueva-contrasena">Nueva Contraseña:</label>
            <input type="password" id="nueva-contrasena" name="newPassword" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(cumpleContrasenia == false && contDistintaAVieja) && <p className="textoNoCumple">La contraseña no cumple las condiciones</p>}
            {(contDistintaAVieja == false) && <p className="textoNoCumple">La nueva contraseña es igual a la anterior</p>}
          </div>
          <div class="form-group">
            <label for="repetir-contrasena">Repetir Contraseña:</label>
            <input type="password" id="repetir-contrasena" name="newPasswordRepeat" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(coincidenContrasenias == false) && <p className="textoNoCumple">Las contraseñas no coinciden</p>}
          </div>
          <div className='botones-contrasenia'>
            <button type="submit" className='botonCambiarContrasenia' onClick={handleCambiarContrasenia}>Guardar</button>
            {user.rol == 3 ?
              <Link to={routes.adminEditarPerfil}><button className='botonCancelar'>Cancelar</button></Link>
            :
            <Link to={routes.editarPerfil}><button className='botonCancelar'>Cancelar</button></Link>
            }
            
          </div>
        </div>

      </div>
      <Modal texto={'La contraseña actual ingresada no es correcta'} confirmacion={contraIncorrecta} setConfirmacion={setContraIncorrecta} ok={true} />
      <Modal texto={"Cambio exitoso"} confirmacion={cambiarContrasenia} setConfirmacion={setCambiarContrasenia} handleYes={handleOk} ok={true}/>

    </main>
  )
}

export default CambiarContrasenia