import { Routes, Route, useLocation } from "react-router-dom"
import PaginaPrincipal from "../views/PaginaPrincipal"
import SubirArticulo from "../views/SubirArticulo"
import MisArticulos from "../views/MisArticulos"
import TruequesPyC from "../views/TruequesPyC"
import Promociones from "../views/Promociones"
import Perfil from "../views/Perfil"
import EditarPerfil from "../views/EditarPerfil"
import Header from "../components/Header/Header"
import NotFound from "../views/NotFound"
import CambiarContrasenia from "../views/CambiarContrasenia"

const RutasUser = () => {
    const location = useLocation()

    const rutaDefinida = () => {
        return (
            [
                'subir_articulo',
                'mis_articulos',
                'mis_trueques',
                'promociones',
                'perfil',
                'editar_perfil',
                'cambiar_contrasenia'
            ].includes(location.pathname.split('/')[2]) || location.pathname === '/user'
        )
    }

    return (
        <>
            {rutaDefinida() && <Header />}
            <Routes>
                <Route path={''} element={<PaginaPrincipal />} />
                <Route path={'subir_articulo'} element={<SubirArticulo />} />
                <Route path={'mis_articulos'} element={<MisArticulos />} />
                <Route path={'mis_trueques'} element={<TruequesPyC/>} />
                <Route path={'promociones'} element={<Promociones />} />
                <Route path={'perfil'} element={<Perfil />} />
                <Route path={"editar_perfil"} element={<EditarPerfil />} />
                <Route path={'cambiar_contrasenia'} element={<CambiarContrasenia />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default RutasUser