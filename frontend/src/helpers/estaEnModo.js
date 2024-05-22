  const user=JSON.parse(localStorage.getItem('user'))
  const cuentaActual= (localStorage.getItem('cuentaActual'))

function estaEnModoUser(){ 
    return (
      user.rol == 1 || (user.rol == 2 && cuentaActual == 'usuario')
    )
  }
  
function estaEnModoAdmin(){
    return (
      user.rol == 3
    )
  }
  
function estaEnModoEmple(){
    return (
      (user.rol == 2 && cuentaActual == 'empleado')
    )
  }

  export {estaEnModoUser, estaEnModoEmple, estaEnModoAdmin}