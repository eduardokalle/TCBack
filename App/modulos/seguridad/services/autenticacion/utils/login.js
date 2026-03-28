const { Usuario } = require('../../../models/usuario');
const { Rol } = require('../../../models/rol');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { bcrypt } = require('../../../../../config');

const login = async (req, res) => {

	const email = req.email;
	const contrasena = req.contrasena;
	
	let token = '';
	let refreshToken = '';
	let usuario_logueado = {};
	
	const hashed_contrasena = bcrypt.hashSync(contrasena, 8);

	const usuario = await Usuario.findAll({
		attributes: ['id', 'email', 'nombre', 'apellido', 'contrasena', 'rol_id'],
		where: { email: email, estado: 1 },
		include: [{
			model: Rol,
			as: 'rol',
			attributes: ['nombre']
		}]
	});
	if (usuario.length === 1) {
		const contrasena_valida = bcrypt.compareSync(contrasena, usuario[0].contrasena);

		if (contrasena_valida) {
			token = cifrar({
				id: usuario[0].id,
				nombre: usuario[0].nombre,
				rol: usuario[0].rol_id,
			});

			refreshToken = setRefreshToken(usuario[0].email);

			usuario_logueado.id = usuario[0].id;
			usuario_logueado.username = usuario[0].email;
			usuario_logueado.password = usuario[0].contrasena;
			usuario_logueado.email = usuario[0].email;
			usuario_logueado.accessToken = token;
			usuario_logueado.refreshToken = refreshToken;
			usuario_logueado.roles = [usuario[0].rol.nombre] // ['ADMIN'];
			usuario_logueado.pic = '';
			usuario_logueado.fullname = usuario[0].nombre+' '+usuario[0].apellido;
		}
	}

	res.send(usuario_logueado);
}

module.exports = {
	login: login
}