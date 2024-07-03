import React from 'react'
import '../../styles/DropNotificaciones.css'
import { useEffect , useState} from 'react';
import UnaNotificacion from './UnaNotificacion'

function DropNotificaciones({setNuevaNoti}) {
  const [notificaciones, setNotificaciones]= useState([])
  const [tiene, setTiene]= useState(false)
  const [obtenido, setObtenido]= useState(false)
  
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
        setNotificaciones(nuevasNotis)
        if (nuevasNotis.length > 0){
          setNuevaNoti(true)
          setTiene(true)
        }
        else setNuevaNoti(false)
        setObtenido(true)
      })
      .catch(error => {
        console.error('Error:', error);
      });
},[])

console.log("noti: ", notificaciones)
  return (
    <div className='dropNotificaciones'>
        <h4>Notificaciones</h4>
        <hr style={{marginBottom:'10px'}}></hr>
        {
        obtenido ?
          tiene ?
          <div className='divNotificaciones'>
          
           { notificaciones.map((noti) =>(
              <UnaNotificacion contenido={noti} soyLaUltima={notificaciones.length == 1} setNuevaNoti={setNuevaNoti}/>
            ))}
          </div>
          :
          <p>No tenés notificaciones</p>
        :
          <p>Cargando...</p>
        }

    </div>
  )
}

export default DropNotificaciones