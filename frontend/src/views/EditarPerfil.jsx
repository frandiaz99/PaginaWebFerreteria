import React from 'react'


function EditarPerfil() {

    const [usuario, setUsuario] = useState();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetch('http://localhost:5000/user/getSelf',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/JSON",
                }, credentials: "include"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema al obtener los articulos');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setUsuario(data.User)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])

    return (
        <main className='main'>
            <div>Editar Perfil</div>
        </main>
    )


}

export default EditarPerfil