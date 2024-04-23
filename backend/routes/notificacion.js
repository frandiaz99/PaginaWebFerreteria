//es aglo  mas local no va a tener rutas
//cuadno se hacen ciertas cosas se va tener q crear una instancia
//notificacionSchema









const getNotificacionesNuevas  = async (ID) => {
  await DataNotificacion.find({_id: ID, visto: false}, -usuario)
  .then((Notificaciones) =>{
    //console.log();
/*    if (! Notificaciones){
      return("");
    }*/
    return(Notificaciones);
  }).catch((err) =>{
    return({"message": "Error fetching the notifications"});
  })
};



module.exports = {getNotificacionesNuevas};