import React from 'react'
import '../styles/PaginaPrincipal.css'
import Articulo from '../components/Articulo'
import UltimoTrueque from '../components/UltimoTrueque'
import Paginacion from '../components/Paginacion'
import Filtros from '../components/Filtros'
import { useState, useEffect, useRef } from 'react'

const articulosXPag = 5 //en cada pagina mostrar 5 articulos


function PaginaPrincipal() {
  const [totalArticulos, setTotalArticulos] = useState([])
  const [articulosActuales, setArticulosActuales] = useState(totalArticulos) //aca se guardan los filtrados
  const [ultimosTrueques, setUltimosTrueques]= useState([])
  const [ultimosObtenido, setUltimosObtenido]= useState(false)
  const [pagActual, setPagActual] = useState(1);
  const [obtenido, setObtenido]= useState(false)
  const articulosRef = useRef(null)

  const handlePageChange = (pagina) => {
    articulosRef.current.scrollTop = 0 //Sube el scroll cuando cambias de pagina
    setPagActual(pagina)
  }

  const handleFiltros = (resultado) => {
    setArticulosActuales(resultado)
  }

  function mostrarArticulos() {
    const ultimoarticulo = pagActual * articulosXPag
    const primerArticulo = ultimoarticulo - articulosXPag
    return articulosActuales.slice(primerArticulo, ultimoarticulo)
  }

  useEffect(() => {
    setArticulosActuales(totalArticulos)
  }, [totalArticulos]) //Solo cambia la primera vez


  useEffect(() => {
    fetch('http://localhost:5000/articulo/getArticulos',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          //"Cookie": localStorage.getItem('jwt')
        }, credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los articulos');
        }
        return response.json();
      })
      .then(data => {
        setTotalArticulos(data.filter(d => d.precio > 0 && d.usuario.intento_desbloqueo < 3 && !d.reservado))
        setObtenido(true)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/trueque/getUltimosTrueques", {
      method: "GET",
      headers: { "Content-Type": "application/JSON" },
      credentials: "include"
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
        console.log(data)
        setUltimosTrueques(data.Trueque)
        setUltimosObtenido(true)
      })
      .catch(error => {
        console.error('Error:', error);
        setUltimosTrueques([])
        setUltimosObtenido(true)
      })
  }, []);

  return (
    <>
      <main className='main'>

        <div className='body-trueques'>
          <div className='contenedor-ultimos-trueques'>
            <div className='div-titulo-ultimo-trueque'>
              <h3 className='tituloUltimoTrueques'>Últimos Trueques</h3>
            </div>
            <div className='ultimosTrueques'>
              <div className='ultimosTrueques-lista'>
                {ultimosObtenido
                ?
                  ultimosTrueques.length > 0
                  ?
                    ultimosTrueques.map((ultimoT, indice) => (
                      <UltimoTrueque key={indice} ultimoT={ultimoT}/>
                    ))
                  :
                    <p style={{padding:'10px'}}>No se realizó ningún trueque aún</p>
                :
                  'Cargando...'
                }
              </div>
            </div>
          </div>

          <><hr className='hr-pagina-principal' /> </>
          <div className='main-articulos'>
            <Filtros totalItems={totalArticulos} actualizar={handleFiltros} />

            <div className='articulos' ref={articulosRef}>
              {(totalArticulos.length == 0 || articulosActuales == 0) ?
                <div className='noHayItems'>
                  {obtenido ? 'No hay articulos disponibles aún' : 'Cargando artículos...'}
                </div> //Podria ser un componente
                :
                mostrarArticulos().map((art, index) => (<Articulo key={index} articulo={art} misArticulos={false} />))
              }
            </div>

            {articulosActuales.length > 0 && <Paginacion totalItems={articulosActuales.length} itemsXPag={articulosXPag} onPageChange={handlePageChange} />}
          </div>
        </div>
      </main>
    </>
  );
}

export default PaginaPrincipal
