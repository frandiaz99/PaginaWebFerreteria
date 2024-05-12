import '../styles/UltimoTrueque.css'

function UltimoTrueque() {
    return (
        <><hr className='hr-ultimos-trueques' />
            <div className='ultimoTrueque'>

                <img className='fotoUser-ultimoTrueque' src="https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg" alt="User1" />
                <div className='contenido-ultimoTrueque'>
                    <div className='articulosCambiados-ultimoTrueque'>
                        <img className='fotoArticulo-ultimoTrueque' src="https://www.wurth.com.ar/blog/wp-content/uploads/2022/11/martillo-de-carpintero.jpg" alt="Art 1" />
                        <img className='simbolo-ultimoTrueque' src="truequeicono.avif" alt="simbolTrueque" />
                        <img className='fotoArticulo-ultimoTrueque' src="https://www.wurth.com.ar/blog/wp-content/uploads/2022/11/martillo-de-carpintero.jpg" alt="Art 2" />
                    </div>
                    <p className='fechaTrueque-ultimoTrueque'>dia/mes/año</p>
                </div>
                <img className='fotoUser-ultimoTrueque' src="https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg" alt="User2" />

            </div>
        </>

    )
}

export default UltimoTrueque