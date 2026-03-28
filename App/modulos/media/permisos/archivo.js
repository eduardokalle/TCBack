const { Archivo } = require('../models/archivo');

const borrar = async (parametros, datosUsuario) => {
    
    let autorizado = false;
    
    const archivosIds = parametros.ids;
    const ids = archivosIds.split(',');
    let id;
    let busqueda;
    let archivos;

    for(let i in ids){
    	id = ids[i];

    	busqueda = {
	        attributes: ['id'],
	        where: {
	            id: id,
	            usuario_id: datosUsuario.id,
	        }
	    }

	    archivos = await Archivo.findAll(busqueda);

	    if(archivos.length != 0) {
	    	autorizado = true;
	    }
	    else {
	    	autorizado = false;
	    	break;
	    }
    }

    return autorizado;
}

const editar = (parametros, datosUsuario) => {

    
}

module.exports = {
	archivoBorrar: borrar,
	archivoEditar: editar,
}