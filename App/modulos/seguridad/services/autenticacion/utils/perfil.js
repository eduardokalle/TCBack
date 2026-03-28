const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar } = require('./jwt');
const { bcrypt } = require('../../../../../config');

const perfil = async ({
    user_id
}, res) => {

	const usuario = await Usuario.findAll({
		attributes: ['id', 'nombre', 'apellido'],
		where: { id: user_id }
	});

	res.send({
		usuario: usuario
	});
}

module.exports = {
	perfil: perfil
}