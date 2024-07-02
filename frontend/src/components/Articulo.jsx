import { useNavigate} from 'react-router-dom'
import '../styles/Articulo.css'
import routes from '../routes'
import Modal from './Modal.jsx'
import { useEffect, useState } from 'react'

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

function Articulo({ articulo, misArticulos, eliminar = () => console.log("nada")}) {
    const navigate= useNavigate()
    const [confirmacion, setConfirmacion]= useState(false)
    const [irAUnArticulo, setIrAUnArticulo]= useState(false)

    const handleYes= () =>{
        setConfirmacion(false)
        console.log("artt_", articulo)
        fetch('http://localhost:5000/articulo/borrarArticulo', 
        {method: "DELETE", 
        headers: { "Content-Type": "application/JSON"},
        body: JSON.stringify({Articulo: articulo}),
        credentials: "include"})
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
                throw new Error(JSON.stringify({message: data.message}));
            })
          }
          return response.json();
        })
        .then(data => {
            eliminar()
        })
        .catch(error => {
          const errorData= JSON.parse(error.message)
          console.log(errorData.message)
        });
    }

    const handleEliminarArt= (event) =>{
        event.stopPropagation(); 
        setConfirmacion(true)
    }

    const irArticulo= ()=>{
        if (location.pathname !== routes.pagPrincipal /*invitado*/){
            localStorage.setItem('articulo',JSON.stringify(articulo))
        }
        setIrAUnArticulo(true)
    }

    useEffect(() => {
        if (irAUnArticulo) navigate(routes.unArticulo)
    }, [irAUnArticulo])

    var srcFotoArt = "http://localhost:5000/img/" + articulo.foto_articulo[articulo.foto_articulo.length-1];

    if(!misArticulos) return (
            <div className='articulo' onClick={irArticulo}>
                <div className='divImagenArt'>
                    <img src={srcFotoArt} alt="" className='imagenArt' />
                </div>
                <div className='articulo-contenido'>
                    <div className='tituloYicon'>
                        <h2 className='tituloArt'>{articulo.nombre}</h2>
                        {(articulo.promocionado && articulo.promocionado.aprobado) && <ion-icon name="cash-outline"></ion-icon>
                        }
                    </div>
                    <p className='descripcionArt'>{articulo.descripcion}</p>
                    <p>Categoria {articulo.precio}</p>
                    <div className='interesado_y_puntaje'>
                        <p>Interesado en: ...</p>
                        <div className='usuarioEnArticulo'>
                            <p>{articulo.usuario.nombre}</p>
                            <p>{generarEstrellas(articulo.usuario.valoracion)}</p>
                        </div>
                    </div>
                </div>
            </div>
    )
    else return(
        <>
            <div className='miArticulo' onClick={irArticulo}>
                <div className='divImagenArt-miArticulo'>
                    <img src={srcFotoArt} alt="" className='imagenMiArt' />
                </div>
                <div className='miArticulo-contenido'>
                    <div className='miArticulo-contenido-contenido'>
                        <h4 className='tituloArt'>{articulo.nombre}</h4>
                       {articulo.precio >0 && <p>Categoria {articulo.precio}</p>}
                    </div>
                    <div className='buttonYicon'>
                    <div className='iconMiArt'>
                        {(articulo.promocionado && articulo.promocionado.aprobado) && <ion-icon name="cash-outline"></ion-icon>}
                    </div>
                    <button className='eliminarMiArticulo' onClick={handleEliminarArt}>Borrar articulo</button>
                    </div>
                </div>
            </div>
            <Modal texto={'¿Estás seguro que querés eliminar este artículo?'} confirmacion={confirmacion} setConfirmacion={setConfirmacion} handleYes={handleYes} ok={false}/>
        </>
    )
}

export default Articulo