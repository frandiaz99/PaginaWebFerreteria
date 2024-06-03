import '../styles/UltimoTrueque.css'

function getDateOnly(datetimeLocalString) {
    const datetime = new Date(datetimeLocalString);
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

function UltimoTrueque({ultimoT}) {
    const userPublica = ultimoT.articulo_publica.usuario;
    const userCompra = ultimoT.articulo_compra.usuario;
    return (
        <>
            <div className='ultimoTrueque'>

                <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userPublica.foto_perfil}`} alt="User1" />
                <div className='contenido-ultimoTrueque'>
                    <div className='articulosCambiados-ultimoTrueque'>
                        <img className='fotoArticulo-ultimoTrueque' src={`http://localhost:5000/img/${ultimoT.articulo_publica.foto_articulo}`} alt="Art 1" />
                        <img className='simbolo-ultimoTrueque' src="truequeicono.avif" alt="simbolTrueque" />
                        <img className='fotoArticulo-ultimoTrueque' src={`http://localhost:5000/img/${ultimoT.articulo_compra.foto_articulo}`} alt="Art 2" />
                    </div>
                    <p className='fechaTrueque-ultimoTrueque'>{getDateOnly(ultimoT.fecha_venta)}</p>
                </div>
                <img className='fotoUser-ultimoTrueque' src={`http://localhost:5000/img/${userCompra.foto_perfil}`} alt="User2" />

            </div>
        </>

    )
}

export default UltimoTrueque