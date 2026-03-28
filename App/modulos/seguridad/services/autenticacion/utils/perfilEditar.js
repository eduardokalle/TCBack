const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { joi } = require('../../../../../config');
const { bcrypt, baseURL } = require('../../../../../config');
const { send } = require('../../../../email/send');

const perfilEditar = async (req, res) => {

	console.log(req.body);
	console.log(req.params);

	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let email = req.body.email;
	let fechaNacimiento = req.body.fechaNacimiento;
	let password = req.body.password;
	let user_id = req.body.user_id;

	const schema = {
		nombre: joi.string().min(3).max(30).required(),
		apellido: joi.string().min(3).max(30).required(),
		password: joi.alternatives().try(joi.string().regex(/^[a-zA-Z0-9]{3,30}$/), joi.string().valid('')),
	};

	const { error, value } = joi.validate({ 
											nombre,
											apellido,
											password,
										}, schema);

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(user_id);

	if( !error ){

		let usuario;

		if(password != '') {
			const hashed_contrasena = bcrypt.hashSync(password, 8);

			try {
				await Usuario.update(
					{ 
						contrasena: hashed_contrasena,
					},
					{ 
						where: {
							id: user_id
						} 
					}
				)
			}
			catch (error) {
				return res.status(400).send('error');
			}
		}

		try {
			usuario = await Usuario.update(
				{ 
					nombre: nombre,
					apellido: apellido,
					fechaNacimiento: fechaNacimiento,
					email: email
				},
				{ 
					where: {
						id: user_id
					} 
				}
			)
		}
		catch (error) {
			console.log(error);
			return res.status(400).send('error');
		}

		res.send({
			usuario: usuario
		});
	}
	else {
		res.status(500).send('Error de validación');
	}
}

module.exports = {
	perfilEditar: perfilEditar
}