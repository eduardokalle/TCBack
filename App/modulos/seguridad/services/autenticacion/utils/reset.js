const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { bcrypt } = require('../../../../../config');

const reset = async ({
    token,
    password,
    email
}, res) => {


	let usuario;

	try {
		usuario = await Usuario.findAll({
			attributes: ['id', 'reset_token'],
			where: { email: email }
		});
	}
	catch (error) {
		console.log(error);
		return res.status(400).send('error');
	}

	if (usuario.length === 1) {

		if(usuario[0].reset_token == token) {
			const hashed_contrasena = bcrypt.hashSync(password, 8);

			try {
				await Usuario.update(
					{ 
						contrasena: hashed_contrasena,
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
				return res.status(400).send({ status: 'error' });
			}

			return res.status(200).send({ status: 'ok' });
		}
		else {
			console.log('Token no coincide');
			return res.status(400).send({ status: 'error' });	
		}

	}
	else {
		console.log('No se enontró el usuario con ese correo');
		return res.status(400).send({ status: 'error' });
	}
}

module.exports = {
	reset: reset
}