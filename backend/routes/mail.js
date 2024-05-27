const express = require("express");
const { DataUser, DataNotificacion, DataSucursal } = require("../model/Schema");
const { adminAuth, workerAuth, userAuth } = require("../middleware/auth");
const router = express.Router();

//const upload = require("../imagenes/imagen.js");

const { getNotificacionesNuevas } = require("./notificacion");
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
const mandarMail = async (mailDestino, mailTipo, mailMensaje) =>{
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



const mandarMail = async (mailDestino, mailTipo, mailMensaje) =>{
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
  mandarMail(para, tipo, mensaje)
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
module.exports = {mandarMail}  ;


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





/*



const codigoHTML = ("<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
      body {width: 600px;margin: 0 auto;}
      table {border-collapse: collapse;}
      table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
      img {-ms-interpolation-mode: bicubic;}
    </style>
    <![endif]-->

    <style type="text/css">
      body, p, div {
        font-family: arial,helvetica,sans-serif;
        font-size: 14px;
      }
      body {
        color: #000000;
      }
      body a {
        color: #1188E6;
        text-decoration: none;
      }
      p { margin: 0; padding: 0; }
      table.wrapper {
        width:100% !important;
        table-layout: fixed;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      img.max-width {
        max-width: 100% !important;
      }
      .column.of-2 {
        width: 50%;
      }
      .column.of-3 {
        width: 33.333%;
      }
      .column.of-4 {
        width: 25%;
      }
      @media screen and (max-width:480px) {
        .preheader .rightColumnContent,
        .footer .rightColumnContent {
            text-align: left !important;
        }
        .preheader .rightColumnContent div,
        .preheader .rightColumnContent span,
        .footer .rightColumnContent div,
        .footer .rightColumnContent span {
          text-align: left !important;
        }
        .preheader .rightColumnContent,
        .preheader .leftColumnContent {
          font-size: 80% !important;
          padding: 5px 0;
        }
        table.wrapper-mobile {
          width: 100% !important;
          table-layout: fixed;
        }
        img.max-width {
          height: auto !important;
          max-width: 480px !important;
        }
        a.bulletproof-button {
          display: block !important;
          width: auto !important;
          font-size: 80%;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .columns {
          width: 100% !important;
        }
        .column {
          display: block !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      }
    </style>
    <!--user entered Head Start-->
    
     <!--End Head user entered-->
  </head>
  <body>
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial,helvetica,sans-serif; color: #000000; background-color: #FFFFFF;">
      <div class="webkit">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
          <tr>
            <td valign="top" bgcolor="#FFFFFF" width="100%">
              <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="100%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <!--[if mso]>
                          <center>
                          <table><tr><td width="600">
                          <![endif]-->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                            <tr>
                              <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#FFFFFF" width="100%" align="left">
                                
    <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"
           style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
      <tr>
        <td role="module-content">
          <p></p>
        </td>
      </tr>
    </table>
  
    <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/c37ca2251b51dbe1/3b9671b1-5890-4c0b-b8e0-4dedf131b5c1/1692x249.png">
        </td>
      </tr>
    </table>
  
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;"
            height="100%"
            valign="top"
            bgcolor="">
            <div style="font-family: inherit; text-align: left">&nbsp;</div>

<div>&nbsp;</div>

        </td>
      </tr>
    </table>
  
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td style="padding:18px 0px 18px 0px;line-height:30px;text-align:inherit;"
            height="100%"
            valign="top"
            bgcolor="">
            <h2 style="text-align: center">&nbsp;</h2>

<div>&nbsp;</div>

        </td>
      </tr>
    </table>
  <div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="color:#444444;font-size:12px;line-height:20px;padding:16px 16px 16px 16px;text-align:center"><p style="font-family:[Sender_Name];font-size:12px;line-height:20px"><a class="Unsubscribe--unsubscribeLink" href="<%asm_group_unsubscribe_raw_url%>">Unsubscribe</a> - <a class="Unsubscribe--unsubscribePreferences" href="{{{unsubscribe_preferences}}}">Unsubscribe Preferences</a></p></div><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td height="100%" valign="top">
          <div style=" display:flex; align:center; justify-content:center;" valign="top">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:10% !important; width:10%; height:auto !important;" width="60" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/c37ca2251b51dbe1/9e24bde9-3e1a-48f8-9e97-81443e225aaf/8459x8569.png">
          <div style="font-family: inherit; text-align: left; align-self: center;">Batitech</div>
 </div>
        </td>
      </tr>
    </table>
                              </td>
                            </tr>
                          </table>
                          <!--[if mso]>
                          </td></tr></table>
                          </center>
                          <![endif]-->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>
</html>
");

*/