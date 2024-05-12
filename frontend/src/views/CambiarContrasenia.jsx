import React, { useState, useEffect } from 'react'
import '../styles/CambiarContrasenia.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import routes from "../routes";

function CambiarContrasenia() {
  const [coincidenContrasenias, setCoincidenContrasenias] = useState(false) //si las 2 nuevas contraseñas coinciden
  const [cumpleContrasenia, setCumpleContrasenia] = useState(false)
  const [contDistintaAVieja, setContDistintaAVieja] = useState(false)
  const [anteriorIgualActual, setAnteriorIgualActual]= useState(false)
  const [cambiarContrasenia, setCambiarContrasenia] = useState(false)
  const [datos, setDatos] = useState(
    {
      password: '',
      newPassword: '',
      newPasswordRepeat: ''
    }
  )


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

  const verificaDistinta = (nuevaContrasenia) => {
    if (nuevaContrasenia === '') return null
    return nuevaContrasenia !== JSON.parse(localStorage.getItem('user')).rawPassword
  }

  const handleCambiarContrasenia = (event) => {
    event.preventDefault();
    if (coincidenContrasenias && cumpleContrasenia && contDistintaAVieja && anteriorIgualActual){

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
    window.location.href = routes.perfil
  };

  useEffect(() => {  //Verificar que coincidan las contraseñas y que cumpla los requisitos de contraseña   
    setCoincidenContrasenias(verificarContrasenias(datos.newPassword, datos.newPasswordRepeat))
    setCumpleContrasenia(verificarCondicionContrasenia(datos.newPassword))
    setContDistintaAVieja(verificaDistinta(datos.newPassword))
  }, [datos.newPassword, datos.newPasswordRepeat])

  useEffect(() =>{
    setAnteriorIgualActual(!verificaDistinta(datos.password))
  }, [datos.password])

  return (
    <main className='main'>
      <div class="container">
        <h2>Cambiar Contraseña</h2>
        <div className='div-form'>
          <div class="form-group">
            <label for="contrasena-anterior">Contraseña anterior:</label>
            {/*<input type="password" id="contrasena-anterior" className="contrasena-anterior" required /> */}
            <input type="password" id="contrasena-anterior" className="passwordCambiarContrasenia" name='password' required onChange={handleChange} />
            {anteriorIgualActual == false && <p className="textoNoCumple">Contraseña incorrecta</p>}
          </div>
          <div class="form-group">
            <label for="nueva-contrasena">Nueva Contraseña:</label>
            <input type="password" id="nueva-contrasena" name="newPassword" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(cumpleContrasenia == false) && <p className="textoNoCumple">La contraseña no cumple las condiciones</p>}
            {(contDistintaAVieja == false) && <p className="textoNoCumple">La nueva contraseña es igual a la anterior</p>}
          </div>
          <div class="form-group">
            <label for="repetir-contrasena">Repetir Contraseña:</label>
            <input type="password" id="repetir-contrasena" name="newPasswordRepeat" className="passwordCambiarContrasenia" required onChange={handleChange} />
            {(coincidenContrasenias == false) && <p className="textoNoCumple">Las contraseñas no coinciden</p>}
          </div>
          <div className='botones-contrasenia'>
            <button type="submit" className='botonCambiarContrasenia' onClick={handleCambiarContrasenia}>Guardar</button>
            <Link to={routes.editarPerfil}><button className='botonCancelar'>Cancelar</button></Link>
          </div>
        </div>

      </div>

      <Modal texto={"Cambio exitoso"} confirmacion={cambiarContrasenia} setConfirmacion={setCambiarContrasenia} handleYes={handleOk} ok={true}></Modal>

    </main>
  )
}

export default CambiarContrasenia