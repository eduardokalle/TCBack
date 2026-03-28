const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('../../autenticacion/utils/jwt');
const { joi } = require('../../../../../config');
const { bcrypt, baseURL } = require('../../../../../config');
const { send } = require('../../../../email/send');

const editar = async (req, res) => {

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const fechaNacimiento = req.body.fechaNacimiento;
    const password = req.body.password;
    let user_id = req.params.id;

	const schema = {
		nombre: joi.string().min(3).max(30).required(),
		apellido: joi.string().min(3).max(30).required(),
		email: joi.string().min(3).max(30).required(),
		password: joi.alternatives().try(joi.string().regex(/^[a-zA-Z0-9]{3,30}$/), joi.string().valid('')),
	};

	if(user_id == 0) {
		user_id = req.body.user_id;
	}

	const { error, value } = joi.validate({ 
											nombre,
											apellido,
											email,
											password,
										}, schema);

	console.log(error);

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
					email: email,
					fecha_nacimiento: fechaNacimiento
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
	editar: editar
}