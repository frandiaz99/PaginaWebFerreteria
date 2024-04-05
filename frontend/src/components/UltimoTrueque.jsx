import '../styles/UltimoTrueque.css'

function UltimoTrueque (){
    return(
        <div className='unTrueque'>
            <img className= 'fotoUser' src="https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg" alt="User1" />
            <div className='contenido'>
                <div className='articulosCambiados'>
                    <img className= 'fotoArticulo' src="https://www.wurth.com.ar/blog/wp-content/uploads/2022/11/martillo-de-carpintero.jpg" alt="Art 1" />
                    <img className='simbolo' src="truequeicono.avif" alt="simbolTrueque" />
                    <img className='fotoArticulo' src="https://www.wurth.com.ar/blog/wp-content/uploads/2022/11/martillo-de-carpintero.jpg" alt="Art 2" />
                </div>
                <p className='fechaTrueque'>dia/mes/año</p>
            </div>
            <img className='fotoUser' src="https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg" alt="User2" />
        </div>
    )
}

export default UltimoTrueque