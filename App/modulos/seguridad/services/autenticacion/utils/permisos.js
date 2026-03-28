const { Usuario } = require('../../../models/usuario');
const { UrlRestringida } = require('../../../models/urlRestringida');
const { Permiso } = require('../../../models/permiso');
const { permisoVerificar } = require('./permisoVerificar')

const permisos = async (url, datosUsuario, req) => {

	const urlParts = url.split('/');
		
	const modulo = urlParts[1];
	const entidad = urlParts[2];
	const accion = urlParts[3];

	const baseURL = urlParts[1]+'/'+urlParts[2]+'/'+urlParts[3];

	const urlRestringida = await UrlRestringida.findAll({
		attributes: ['id'],
		where: { url: baseURL },
		include: [{
			model: Permiso,
			as: 'permisos',
			attributes: ['rol_id', 'metodo', 'verificar']
		}]
	});

	if(urlRestringida.length === 0) {
		return true;
	}
	else {
		const restriccion = urlRestringida[0];
		
		if(restriccion.permisos.length == 0) {

			return true;
		}
		else {

			let autorizado = false;
			let permiso;

			
			for (let p in restriccion.permisos) {
				permiso = restriccion.permisos[p];

				if(permiso.rol_id == datosUsuario.rol) {
					if(permiso.verificar == 0) {
						autorizado = true;
					}
					else {
						autorizado = await permisoVerificar(url, datosUsuario, req);
					}
				}
			}
			return autorizado;
		}
	}

}

module.exports = {
	permisos: permisos
}