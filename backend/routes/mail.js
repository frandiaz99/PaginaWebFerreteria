const express = require("express");
const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const router = express.Router();

//const upload = require("../imagenes/imagen.js");

//const { getNotificacionesNuevas } = require("./notificacion");
//
//
//const SENDGRID_API_KEY = "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";
//const SENDGRID_API_KEY = "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";
const SENDGRID_API_KEY = "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";

//const BASEHTML = require("../mail/BASE_HTML.txt");
//const BASEHTML = codigoHTML;

const sgMail = require('@sendgrid/mail');
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(SENDGRID_API_KEY);
/*
let msg = {
  //to: 'juliq.gelp@gmail.com',
  from: 'batitechoficial@gmail.com',                  //destinatario
  //subject: 'Learning to Send with Twilio SendGrid',   //ASUNTO
  //Subject: 'hola2',   //ASUNTO
  //text: 'and easy to do anywhere, even with Node.js', //eto ni idera q es
  //html: '<strong>and easy to do anywhere, even with Node.js</strong>',  //body
};
*/
/*  ANDA PERO ES BASICO FALTA ESTILO
const MandarMail = async (mailDestino, mailTipo, mailMensaje) =>{
  console.log(msg)
  msg.to = mailDestino;
  //msg = {text:  `${mailMensaje}` };
  //msg.text = mailMensaje;
  msg.subject = `${mailMensaje}`;
  msg.html = `<p> El codigo para desbloquear es: <strong> ${mailMensaje}</strong> </p>`;
  //ES6
  sgMail.send(msg).then((message) => {
    //console.log("Mail enviado correctamente:", message)
    console.log("Mail enviado correctamente")
    return {ok: true, status: 200};
  }, error => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
        return {ok: false, status: 400};
      }
    }).catch ((error) => {
      console.log ("error", error);
    });
}
*/



const MandarMail = async (mailDestino, mailTipo, mailMensaje) =>{
  //console.log ("mail destiono", mailDestino);
  let msg = {
    from: 'batitechoficial@gmail.com',
    to: mailDestino,
    templateId: 'd-a2bc5befe3804212a7d736b1283125b4',
  }
 
  if (mailTipo == 1){
    //Mail de autenticacion
    msg.dynamicTemplateData = {
      Main: 'El codigo de autenticacion de usuario es: ',
      Important: `${mailMensaje}`
    }
  } else if (mailTipo == 2){
      //Mail aviso
      msg.dynamicTemplateData = {
        Main: `${mailMensaje}`,
      }
      console.log("sacar return en MandarMail")
      return;             ///////////////////////////////////////sacar esto, es para que no mande tantos mail que llegamos al limite
  }


  sgMail.send(msg).then((message) => {
    //console.log("Mail enviado correctamente:", message)
    if (message){
      console.log("Mail enviado correctamente")
      return {ok: true, status: 200};
    }
    console.log (message);
  }, error => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
        return {ok: false, status: 400};
      }
    }).catch ((error) => {
      console.log ("error", error);
    });
}

















//esto va a estar comentado
console.log ("comentar esto para que ande bien")
const sendMail = async (req, res, next) => {
  const {para, tipo, mensaje} = req.body
  MandarMail(para, tipo, mensaje)
  console.log ("termino la ejecucion");
  res.status(200).json("Termino la ejecucion");
}




//routes
//router.route("/sendMail").post(sendMail);
//router.route("/newSucursal").post(adminAuth, newSucursal);

/*
//admin routes
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/desbloquearUser").post(adminAuth, desbloquearUser);
*/


console.log ("comentar esto para que ande bien")
//module.exports = router ;
module.exports = {MandarMail}  ;


/*

const msg = {
  from: 'sender1@example.org',
  subject: 'Ahoy!',
  text: 'Ahoy {{name}}!',
  html: '<p>Ahoy {{name}}!</p>',
  personalizations: [
    {
      to: 'recipient1@example.org',
      substitutions: {
        name: 'Jon'
      }
    },
    {
      to: 'recipient2@example.org',
      substitutions: {
        name: 'Jane'
      }
    },
    {
      to: 'recipient3@example.org',
      substitutions: {
        name: 'Jack'
      }
    }
  ],
};


*/


