import React, { useEffect, useState } from 'react';
import '../styles/PopupEfectivizar.css';
import routes from '../routes';
import Modal from "../components/Modal";

const PopupEfectivizar = ({ show, onClose, truequeAEfectivizar, efectivizar }) => {
    if (!show) return null;

    const [ventas, setVentas] = useState([]);
    const [confirmado, setConfirmado] = useState(false);

    const [idIncorrecto, setIdIncorrecto] = useState(false)
    const [productos, setProductos]=useState([]);
    const [todosLosCampos, setTodosLosCampos]= useState(false)

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        setVentas(prevVentas => {
            const newVentas = [...prevVentas];
            if (name === 'usuario') {
                if (value == "default") {
                    newVentas[index][name] = value;
                }
                else{
                    const selectedUsuario = JSON.parse(value);
                    newVentas[index][name] = selectedUsuario;
                }
            } else {
                newVentas[index][name] = value;
            }
            return newVentas;
        });
    };

    const agregarProducto = () => {
        setVentas(prevVentas => [...prevVentas, { cantidad: null, codigo: null, usuario: null }]);

        console.log("ventassssssssssssssssssssss - > ", ventas)
    };

    const eliminarProducto = (index) => {
        setVentas(prevVentas => prevVentas.filter((_, i) => i !== index));
    };

    const confirmarSeleccion = () => {

        const ventasConUsuario = ventas.map(venta => ({
            ...venta,
            usuario: venta.usuario ? venta.usuario : null
        }));

        fetch('http://localhost:5000/trueque/efectivizarTrueque', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Cookie": localStorage.getItem('jwt')
            },
            body: JSON.stringify({ Ventas: ventasConUsuario, Trueque: truequeAEfectivizar, Efectivizar: efectivizar }),
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(JSON.stringify({ message: data.message, status: data.status }));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (ventas.length > 0) setConfirmado(true)
                else handleOk()
            })
            .catch(error => {
                const errorData = JSON.parse(error.message)
                //console.error('Hubo un problema al guardar los cambios:', error);
                switch (errorData.status) {
                    case 400:
                        setIdIncorrecto(true)
                        break
                    default:
                        console.log(errorData.message)
                }
            });
    };

    const handleOk = () => {
        setConfirmado(false);
        window.location.href = routes.pagPrincipal;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        confirmarSeleccion();
    };

    useEffect(() =>{
        ventas.forEach((venta) => {
            if ((venta.cantidad !== null && venta.cantidad !== '') && (venta.codigo !== null && venta.codigo !== '') && (venta.usuario !== 'default' && venta.usuario !== null)) {
                setTodosLosCampos(true)
            } else {
                setTodosLosCampos(false)
            }
        })
    },[ventas])

    function mostrarProducto(codigo){
        const producto= productos.filter(p => p.codigo == codigo)
        if (producto.length > 0) return producto[0].nombre
        else return '-'
    }


    useEffect(() =>{
        fetch('http://localhost:5000/producto/getProductos',
            {
              method: "GET",
              headers: {
                "Content-Type": "application/JSON",
                //"Cookie": localStorage.getItem('jwt')
              }, credentials: "include"
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Hubo un problema al obtener los productos');
              }
              return response.json();
            })
            .then(data => {
              setProductos(data.Productos)
            })
            .catch(error => {
              console.error('Error:', error);
            });      
    },[])

    const buttonText = efectivizar ? 'Confirmar' : 'Confirmar'; 
    const buttonClass = efectivizar ? 'aceptar' : 'cancelar';

    return (
        <div className="popup-overlay-venta">
            <div className='popup-venta'>
                <button className='cancelar-venta' onClick={onClose}>x</button>
                <h2>Agregar venta</h2>
                <form onSubmit={handleSubmit} className='inputs-venta'>
                    {ventas.map((venta, index) => (
                        <div className='input-row' key={index}>
                            <div className='contenedorInputProducto'>
                                <div className='campos_ventas'>
                                    <input
                                        type="text"
                                        name='codigo'
                                        placeholder="Id producto venta"
                                        //value={venta.codigo}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </div>
                                {venta.codigo == '' 
                                 ? 
                                    <p className='campoObligatorio'>Campo obligatorio</p>
                                 :
                                    venta.codigo == null ? null
                                    :
                                        <p className='productoMostrado'>{mostrarProducto(venta.codigo)}</p>
                                }
                            </div>

                            <div className='contenedorInputProducto'>
                                <div className='campos_ventas'>
                                    <input
                                        type="text"
                                        name='cantidad'
                                        placeholder="Cantidad"
                                        //value={venta.cantidad}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </div>
                                {venta.cantidad == '' && <p className='campoObligatorio'>Campo obligatorio</p>}
                            </div>

                            <div className='contenedorInputProducto'>
                                <div className='campos_ventas'>
                                    <select
                                        name='usuario'
                                        //value={JSON.stringify(venta.usuario)}
                                        onChange={(e) => handleInputChange(index, e)}
                                    >
                                        <option value="default">Seleccione usuario</option>
                                        <option value={JSON.stringify(truequeAEfectivizar.articulo_compra.usuario)}>
                                            {truequeAEfectivizar.articulo_compra.usuario.dni}/{truequeAEfectivizar.articulo_compra.usuario.nombre}
                                        </option>
                                        <option value={JSON.stringify(truequeAEfectivizar.articulo_publica.usuario)}>
                                            {truequeAEfectivizar.articulo_publica.usuario.dni}/{truequeAEfectivizar.articulo_publica.usuario.nombre}
                                        </option>
                                    </select>
                                </div>
                                {venta.usuario == 'default' && <p className='campoObligatorio'>Campo obligatorio</p>}
                            </div>
                            <button type="button" className='remove-row' onClick={() => eliminarProducto(index)}>x</button>
                        </div>
                    ))}
                    <div className='botones-venta'>
                        {(todosLosCampos || ventas.length == 0) && <button type='submit' className={buttonClass} onClick={confirmarSeleccion}>{buttonText}</button>}
                        <button type='button' className='agregar-producto' onClick={agregarProducto}>Agregar Producto</button>
                    </div>
                </form>
                <Modal
                    texto={'La venta se ha agregado con éxito.'}
                    confirmacion={confirmado}
                    setConfirmacion={setConfirmado}
                    handleYes={handleOk}
                    ok={true}
                />
                <Modal texto={'Id de producto inexistente'} confirmacion={idIncorrecto} setConfirmacion={setIdIncorrecto} ok={true} />
            </div>
        </div>
    );
};

export default PopupEfectivizar;
