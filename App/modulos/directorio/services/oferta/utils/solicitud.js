const { UsuarioSolicitud } = require('../../../../seguridad/models/usuarioSolicitud');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const solicitud = async ({
    programaId,
    user_id
}, res) => {

	const schema = {
		programaId: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required()
	};

	const { error, value } = joi.validate({ 
											programaId
										}, schema);

	if(!error) {

		let data = {};

		let currentdate = new Date(); 
		let datetime = currentdate.getFullYear() + "-"
		                + (currentdate.getMonth()+1)  + "-" 
		                + currentdate.getDate() + " "  
		                + currentdate.getHours() + ":"  
		                + currentdate.getMinutes() + ":" 
		                + currentdate.getSeconds();

		try {
			usuarioSolicitud = await UsuarioSolicitud.create({
				programa_id: programaId,
				usuario_id: user_id,
				fecha: datetime
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		data.usuarioSolicitud = usuarioSolicitud;

		return res.send({
			data: data
		});
	}
	else {
		res.status(500).send('Error de validación');
	}
}

module.exports = {
	solicitud: solicitud
}