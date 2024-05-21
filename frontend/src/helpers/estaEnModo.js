function estaEnModoUser(){ 
    return (
      location.pathname.startsWith('/user') || (localStorage.getItem('cuentaActual')) == 'usuario'
      )
  }
  
function estaEnModoAdmin(){
    return (
      location.pathname.startsWith('/admin')
      )
  }
  
function estaEnModoEmple(){
    return (
      location.pathname.startsWith('/empleado') || (localStorage.getItem('cuentaActual')) == 'empleado'
      )
  }

  export {estaEnModoUser, estaEnModoEmple, estaEnModoAdmin}