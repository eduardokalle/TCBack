const { Usuario } = require('../../../models/usuario');
const { Rol } = require('../../../models/rol');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { send } = require('../../../../email/send');
const { bcrypt, baseURL, domain } = require('../../../../../config');

const forgot = async (req, res) => {

	const email = req.email;

	let usuario;
	try {
		usuario = await Usuario.findAll({
			attributes: ['id'],
			where: { email: email }
		});
	}
	catch (error) {
		console.log(error);
		return res.status(400).send('error');
	}

	if (usuario.length === 1) {		

		const token = [...Array(80)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

		try {
			await Usuario.update(
				{ reset_token: token },
				{ 
					where: {
						id: usuario[0].id
					} 
				}
			)
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let link = domain+'login/reset/'+email+'/'+token;

		const html = 'Click aquí para recuperar tu contraseña: <a href="'+link+'">'+link+'<a>';

		send(email, 'Recuperación de contraseña', '', html);

		return res.status(200).send({ status: 'ok' });
	}
	else {
		return res.status(400).send({ status: 'error' });
	}

}

module.exports = {
	forgot: forgot
}