const { usuarioEditar, usuarioDetalle, usuarioBorrar } = require('./usuario');

const seguridadPermiso = async (entidad, accion, req, datosUsuario) => {

	switch(true) {
		case ((entidad === 'usuario') && (accion === 'editar')) :
			return await usuarioEditar(req.params, datosUsuario);
		break

		case ((entidad === 'usuario') && (accion === 'detalle')) :
			console.log("ESTAMOS EN DELTALLE");
			return await usuarioDetalle(req.params, datosUsuario);
		break

		case ((entidad === 'usuario') && (accion === 'borrar')) :
			return await usuarioBorrar(req.params, datosUsuario);
		break
	}
}

module.exports = {
	seguridadPermiso: seguridadPermiso
}