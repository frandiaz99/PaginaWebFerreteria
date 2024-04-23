//es aglo  mas local no va a tener rutas
//cuadno se hacen ciertas cosas se va tener q crear una instancia
//notificacionSchema
const {DataUser, DataNotificacion} = require("../model/Schema")









const getNotificacionesNuevas  = async (ID) => {
  await DataNotificacion.find({_id: ID, visto: false})
  //, -usuario se le podri poner para no remandarle el id del user
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