import React, { useState } from 'react'
import '../styles/CambiarContrasenia.css'
import { useSearchParams } from 'react-router-dom'

function CambiarContrasenia() {

  const [cambiarContrasena, setCambiarContrasena] = useState(false)

  const [datos, setDatos] = useState(
    { contrasenia: '' }
  )

  const handleOk = () => {
    setCambiarContrasena(false);
  };

  const handleCambiarContrasenia = () => {

    setPassIncorrecta(false)

    fetch("http://localhost:5000/user/CambiarContrasena", {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify({ User: newPass }),
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
        console.error('Hubo un problema al guardar los cambios:', error);
        // Manejo de errores
      });



  }

  return (
    <main className='main'>
      <div class="container">
        <h2>Cambiar Contraseña</h2>
        <form>
          <div class="form-group">
            <label for="contrasena-anterior">Contraseña anterior:</label>
            {/*<input type="password" id="contrasena-anterior" className="contrasena-anterior" required /> */}
            <input type="password" id="contrasena-anterior" className="passwordCambiarContrasenia" required />
          </div>
          <div class="form-group">
            <label for="nueva-contrasena">Nueva Contraseña:</label>
            <input type="password" id="nueva-contrasena" name="nueva-contrasena" className="passwordCambiarContrasenia" required />
          </div>
          <div class="form-group">
            <label for="repetir-contrasena">Repetir Contraseña:</label>
            <input type="password" id="repetir-contrasena" name="repetir-contrasena" className="passwordCambiarContrasenia" required />
          </div>
          <button type="submit" className='botonCambiarContrasenia'>Guardar</button>
          <Modal texto={'La contraseña se cambio con exito. '}
            confirmacion={cambiarContrasena} setConfirmacion={setCambiarContrasena} handleYes={handleOk} ok={true} />
        </form>
      </div>
    </main>
  )
}

export default CambiarContrasenia