import { useEffect, useState } from 'react';
import '../styles/PopupPuntuarUsuario.css'


const PuntuarUsuario = ({show, onClose, trueque, yaPuntuo}) => {
    if (!show) return null;
    
    const [acabaDePuntuar,setAcabaDePuntuar]= useState(false)
    const [commentState, setCommentState]= useState('')
    const [comentarioVacio, setComentarioVacio]= useState(true)

    const handleComentario= (e) =>{
        setCommentState(e.target.value)
    }

    useEffect(() =>{
        if (commentState.length > 0) setComentarioVacio(false)
        else setComentarioVacio(true)
    },[commentState]);

    function guardarDatos () {
        setAcabaDePuntuar(true)
        let estrellas = document.getElementById("select-estrellas-popup");
        let comentario = document.getElementById("comentario-popup");
        if (estrellas.value != null && comentario.value != null){
            const valoracion = {
                valoracion: estrellas.value, 
                opinion: comentario.value
            };
            console.log("id trueque: "+trueque._id);
            console.log("valoracion.estrellas: "+valoracion.valoracion);
            console.log("valoracion.opinion: "+valoracion.opinion);
    
            fetch("http://localhost:5000/trueque/valorarTrueque", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({
                    Trueque: trueque,
                    Valoracion: valoracion,
                }),
                credentials: "include",
            })
            .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                })
            }
            return response.json();
            })
            .then(data => {
            console.log("data :", data)
            yaPuntuo()
            setAcabaDePuntuar(false)
            onClose()
            })
            .catch(error => {
            console.error('Error:', error);
            setAcabaDePuntuar(false)
            })
        }
    }
    return(
        <div className="popup-overlay">
            <div className="popup-content">
                <h2 className='titulo-popup-puntuar'>Calificar trueque</h2>
                <div className='container-popup-puntuar'>
                    <div className="container-calificar">
                        Cantidad de estrellas: 
                        <select name="estrellas-popup" id="select-estrellas-popup">
                            <option value="1">1 estrella</option>
                            <option value="2">2 estrellas</option>
                            <option value="3">3 estrellas</option>
                            <option value="4">4 estrellas</option>
                            <option value="5">5 estrellas</option>
                        </select>
                    </div>
                    <div className="container-comentario">
                        <label>Comentanos acerca del usuario</label>
                        <textarea name="comentario-popup" id="comentario-popup" cols="50" rows="5" onChange={handleComentario}></textarea>
                        {comentarioVacio && <p className='textoNoCumple'>Comentar es obligatorio para envíar tu calificación</p>}
                    </div>
                </div>
                <div className='container-botones-puntuar'>
                    {acabaDePuntuar 
                    ?
                        <p>Enviando calificación...</p>
                    :
                    <>
                        {!comentarioVacio && <button className="estilo-botones-puntuar" onClick={() => guardarDatos()}>Puntuar</button>}
                        <button className="estilo-botones-puntuar" onClick={onClose}>Cancelar</button>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}

export default PuntuarUsuario;