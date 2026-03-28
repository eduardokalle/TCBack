const { descifrar } = require('./jwt');
const { permisos } = require('./permisos');

const autorizar = async (req, res, next) => {

	if(req.headers.authorization){

		const token = req.headers.authorization.replace('Bearer ', '');

		if (!token) {
		    res.status(403).send({ auth: false, message: 'No token provided.'});
		}
		else {
			const decoded = descifrar(token);
		
			if(!decoded) {
				res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			}
			else {

				// TODO:
				// Verificar si tiene permisos para la URL actual
				const url = req.originalUrl;
				const datosUsuario = decoded;

				const checkPermisos = await permisos(url, datosUsuario, req);

				if(checkPermisos) {
					req.body.user_id = decoded.id;
					req.body.role_id = decoded.rol;
					next();
				}
				else {
					res.status(500).send({ auth: false, message: 'Unautorized.' });
				}
			}
		}
	}
	else {
		res.status(403).send({ auth: false, message: 'No token provided.'});
	}
}

module.exports = {
	autorizar: autorizar
}