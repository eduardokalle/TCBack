const { archivoBorrar } = require('../../../../media/permisos/archivo');
const { educacionPermiso } = require('../../../../educacion/permisos/controller');
const { seguridadPermiso } = require('../../../../seguridad/permisos/controller');

const permisoVerificar = async (url, datosUsuario, req) => {

	const urlParts = url.split('/');

	const modulo = urlParts[1];
	const entidad = urlParts[2];
	const accion = urlParts[3];


	// ACCION:

	// Listar: 
	// Para listar no hay verificación, solo filtro directamente en la consulta
	// Excepción: Listar de un parent, donde se verifican permisos sobre el parent

	// Borrar: Si el id que quiere borrar, le pertence
	// Ej: Programa:23 [Puede borrar el programa si es delegado de la institucion]

	// Editar: Si el id que quiere ediar, le pertence
	// Ej: Programa:23 [Puede editar el programa si es delegado de la institucion]

	// Crear: Si está habilitado en las relaciones de pertenencia: 
	// Ej: Institucion -< Programas [Puede crear programas en la institucion de la que es delegado]


	switch(modulo){
		case 'media':
			return await archivoBorrar(req.params, datosUsuario);
		break

		case 'educacion':
			return await educacionPermiso(entidad, accion, req, datosUsuario);
		break

		case 'seguridad':
			return await seguridadPermiso(entidad, accion, req, datosUsuario);
		break
	}
}

module.exports = {
	permisoVerificar: permisoVerificar
}