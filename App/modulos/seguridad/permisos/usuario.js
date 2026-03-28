const { Usuario } = require('../models/usuario');

const usuarioSession = async (parametros, datosUsuario) => {

    let autorizado = false;

    if(datosUsuario.id == parametros.id || parametros.id == 0) {
    	return true;
    }
    else {
    	return false;
    }
}

module.exports = {
	usuarioEditar: usuarioSession,
	usuarioDetalle: usuarioSession,
	usuarioBorrar: usuarioSession,
}