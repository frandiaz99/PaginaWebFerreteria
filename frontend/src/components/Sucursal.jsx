// import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from './Modal.jsx'
import '../styles/Sucursal.css'
// import routes from '../routes'
import { estaEnModoAdmin } from '../helpers/estaEnModo';

function Sucursal({ sucursal, eliminar = () => console.log("nada") }) {
    const foto = ("http://localhost:5000/img/" + sucursal.foto);

    const [confirmacion, setConfirmacion] = useState(false)

    const handleYes = () => {
        setConfirmacion(false)
        console.log("sucursal --> ", sucursal)
        fetch('http://localhost:5000/sucursales/eliminarSucursal',
            {
                method: "DELETE",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ Sucursal: sucursal }),
                credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(JSON.stringify({ message: data.message }));
                    })
                }
                return response.json();
            })
            .then(data => {
                eliminar()
            })
            .catch(error => {
                const errorData = JSON.parse(error.message)
                console.error('Hubo un problema al guardar los cambios:', error);
                switch (errorData.status) {
                    case 400:
                        console.log("00")
                        break
                    case 402:
                        console.log("02")
                        break;
                    case 403:
                        console.log("03")
                        break;
                    case 404:
                        console.log("04")
                        break;
                    case 405:
                        console.log("05")
                        break;
                    case 406:
                        console.log("06")
                        break;
                    default:
                        console.log(errorData.message)
                }
            });
    }

    const handleEliminarSucursal = (event) => {
        event.stopPropagation();
        setConfirmacion(true)
    }
    return (

        <div className='sucursal'>
            <img src={foto} alt="" className='sucursal-img' />
            <div className='sucursal-datos'>
                <h3 className='sucursal-nombre'>{sucursal.nombre}</h3>
                <p className='sucursal-localidad'>Direccion: {sucursal.direccion}, {sucursal.ciudad}, {sucursal.provincia}</p>
                <p className='sucursal-telefono'>Telefono: {sucursal.telefono}</p>
                {estaEnModoAdmin() &&
                    <div className='sucursal-boton'>
                        <button className='sucursal-boton-eliminar' onClick={handleEliminarSucursal}>Eliminar Sucursal</button>
                    </div>
                }
            </div>
            <Modal texto={'¿Estás seguro que querés eliminar la sucursal?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={false} />
        </div>

    )
}

export default Sucursal