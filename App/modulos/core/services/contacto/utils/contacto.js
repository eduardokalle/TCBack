const { send } = require('../../../../email/send');
const { bcrypt, baseURL, emailContacto } = require('../../../../../config');

const enviar = async (req, res) => {

	const email = req.email;
	const nombre = req.nombre;
	const mensaje = req.mensaje;

	const html = '<strong>'+nombre+'</strong> ('+email+')<br><br>'+mensaje+'<br><br><i>No responder este mensaje. Redactar uno nuevo con el destinatario correcto.</i>';

	send(emailContacto, 'Contacto sitio web', '', html);

	res.send({
            mensaje: 'ok'
        });

}

module.exports = {
	enviar: enviar
}