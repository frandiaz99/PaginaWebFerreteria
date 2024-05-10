// import { Link } from 'react-router-dom'
import '../styles/Sucursal.css'
// import routes from '../routes'

function Sucursal ({sucursal}){
    const foto = ("http://localhost:5000/img/" + sucursal.foto);
    return (
        
        <div className='sucursal'>
            <h3 className='sucursal-nombre'>{sucursal.nombre}</h3>
            <img src={foto} alt="" className='sucursal-img'/>
            <div className='sucursal-datos'>
                <p className='sucursal-datos'>Direccion: {sucursal.direccion}, {sucursal.ciudad}, {sucursal.provincia}</p>
                <p className='sucursal-telefono'>Telefono: {sucursal.telefono}</p>
            </div>   
        </div>        

    )
}

export default Sucursal