const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { bcrypt } = require('../../../../../config');

const verificar = async ({
    token,
    email
}, res) => {

	let usuario;

	try {
		usuario = await Usuario.findAll({
			attributes: ['id'],
			where: { 
						email: email,
						reset_token: token
					 }
		});
	}
	catch (error) {
		console.log(error);
		return res.status(400).send('error');
	}

	if (usuario.length === 1) {
		return res.status(200).send('ok');
	}
	else {
		return res.status(400).send('error');
	}
}

module.exports = {
	verificar: verificar
}