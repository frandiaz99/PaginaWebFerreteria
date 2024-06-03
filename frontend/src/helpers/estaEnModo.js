
function estaEnModoUser(){
  const user=JSON.parse(localStorage.getItem('user')) 
  const cuentaActual= (localStorage.getItem('cuentaActual'))
    if (user) return user.rol == 1 || (user.rol == 2 && cuentaActual == 'usuario')
    else return false
  }
  
function estaEnModoAdmin(){
  const user=JSON.parse(localStorage.getItem('user'))
    if (user) return user.rol == 3
    else return false
  }
  
function estaEnModoEmple(){
  const user=JSON.parse(localStorage.getItem('user'))
  const cuentaActual= (localStorage.getItem('cuentaActual'))
    if (user) return (user.rol == 2 && cuentaActual == 'empleado')
    else return false
  }

  export {estaEnModoUser, estaEnModoEmple, estaEnModoAdmin}