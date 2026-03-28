const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { bcrypt } = require('../../../../../config');

const activar = async ({
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

		try {
			await Usuario.update(
				{ 
					reset_token: '',
					estado: 1
				},
				{ 
					where: {
						id: usuario[0].id
					} 
				}
			)
		}
		catch (error) {
			console.log(error);
			return res.status(400).send('error');
		}

		return res.status(200).send({ status: 'ok' });
	}
	else {
		console.log('no existe');
		return res.status(400).send('error');
	}
}

module.exports = {
	activar: activar
}