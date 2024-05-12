import React, { useState, useEffect } from 'react'
import '../styles/CambiarContrasenia.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '../components/Modal'
import routes from "../routes";

function CambiarContrasenia() {

  const [coincidenContrasenias, setCoincidenContrasenias] = useState(false) //si las 2 nuevas contraseñas coinciden
  const [cumpleContrasenia, setCumpleContrasenia] = useState(false)
  const [contDistintaAVieja, setContDistintaAVieja] = useState(false)
  const [passIncorrecta, setPassIncorrecta] = useState(false) //cont vieja incorrecta
  // modal --> const [cambiarContrasenia, setCambiarContrasenia] = useState(false)
  const [datos, setDatos] = useState(
    {
      password: '',
      newPassword: '',
      newPasswordRepeat: ''
    }
  )

  // const navigate = useNavigate()

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

  const verificaDistinta = (contrasenia, nuevaContrasenia) => {
    if (contrasenia === '' && nuevaContrasenia === '') return null
    if (!passIncorrecta) {
      return contrasenia !== nuevaContrasenia;
    }
    else return true //para no mostrar el cartel
  }

  const handleCambiarContrasenia = (event) => {
    event.preventDefault();

    setCoincidenContrasenias(false)
    setCumpleContrasenia(false)
    setContDistintaAVieja(false)
    setPassIncorrecta(false)

    if (datos.password !== '' && datos.newPassword !== '' && datos.newPasswordRepeat !== '') {

      fetch("http://localhost:5000/user/cambiarContrasena", {
        method: "POST",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify({ User: datos }),
        credentials: "include"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al guardar los cambios');
          }
          return response.json();
        })
        .then(data => {
          console.log('Respuesta del servidor al editar perfil:', data);
        })
        .catch(error => {
          const errorData = JSON.parse(error.message)
          console.error('Hubo un problema al guardar los cambios:', error);
          switch (errorData.status) {
            case 407:
              setCumpleContrasenia(false)
              console.log("contraseña nueva no cumple condicion -> ", cumpleContrasenia)
            case 408:
              setPassIncorrecta(true)
              console.log("contraseña vieja incorrecta -> ", passIncorrecta)
              break;
            default:
              console.log(errorData.message)
          }
        });
    }
  }

  useEffect(() => {  //Verificar que coincidan las contraseñas y que cumpla los requisitos de contraseña   
    setCoincidenContrasenias(verificarContrasenias(datos.newPassword, datos.newPasswordRepeat))
    setCumpleContrasenia(verificarCondicionContrasenia(datos.newPassword))
    setContDistintaAVieja(verificaDistinta(datos.password, datos.newPassword))
  }, [datos.newPassword, datos.newPasswordRepeat])

  return (
    <main className='main'>
      <div class="container">
        <h2>Cambiar Contraseña</h2>
        <form>
          <div class="form-group">
            <label for="contrasena-anterior">Contraseña anterior:</label>
            {/*<input type="password" id="contrasena-anterior" className="contrasena-anterior" required /> */}
            <input type="password" id="contrasena-anterior" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {passIncorrecta && <p className="textoNoCumple">Contraseña es incorrecta</p>}
          </div>
          <div class="form-group">
            <label for="nueva-contrasena">Nueva Contraseña:</label>
            <input type="password" id="nueva-contrasena" name="nueva-contrasena" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(cumpleContrasenia == false) && <p className="textoNoCumple">La contraseña no cumple las condiciones</p>}
            {(contDistintaAVieja == false) && <p className="textoNoCumple">La nueva contraseña es igual a la anterior</p>}
          </div>
          <div class="form-group">
            <label for="repetir-contrasena">Repetir Contraseña:</label>
            <input type="password" id="repetir-contrasena" name="repetir-contrasena" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(coincidenContrasenias == false) && <p className="textoNoCumple">Las contraseñas no coinciden</p>}
          </div>
          <div className='botones-contrasenia'>
            <button type="submit" className='botonCambiarContrasenia' onClick={handleCambiarContrasenia}>Guardar</button>
            <Link to={routes.editarPerfil}><button className='botonCancelar'>Cancelar</button></Link>
          </div>

        </form>
      </div>
    </main>
  )
}

export default CambiarContrasenia