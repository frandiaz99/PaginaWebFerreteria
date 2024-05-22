
function estaEnModoUser(){
  const user=JSON.parse(localStorage.getItem('user')) 
  const cuentaActual= (localStorage.getItem('cuentaActual'))
    return (
      user.rol == 1 || (user.rol == 2 && cuentaActual == 'usuario')
    )
  }
  
function estaEnModoAdmin(){
  const user=JSON.parse(localStorage.getItem('user'))
    return (
      user.rol == 3
    )
  }
  
function estaEnModoEmple(){
  const user=JSON.parse(localStorage.getItem('user'))
  const cuentaActual= (localStorage.getItem('cuentaActual'))
    return (
      (user.rol == 2 && cuentaActual == 'empleado')
    )
  }

  export {estaEnModoUser, estaEnModoEmple, estaEnModoAdmin}