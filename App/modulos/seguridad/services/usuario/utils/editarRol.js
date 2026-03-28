const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('../../autenticacion/utils/jwt');
const { bcrypt, baseURL } = require('../../../../../config');


const editarRol = async (req, res) => {

    const rolId = req.body.rol;
    const user_id = req.params.id;
    
	let usuario;

	try {
		usuario = await Usuario.update(
			{ 
				rol_id: rolId,
				institucion_id: null,
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

module.exports = {
	editarRol: editarRol
}