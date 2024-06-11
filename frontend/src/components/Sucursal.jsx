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
        fetch('http://localhost:5000/sucursal/eliminarSucursal',
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
                console.log(errorData.message)
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