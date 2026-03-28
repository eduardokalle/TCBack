const { Institucion } = require('../models/institucion');
const { Programa } = require('../models/programa');
const { ProgramaPeriodo } = require('../models/programaPeriodo');
const { Usuario } = require('../../seguridad/models/usuario');
const { UsuarioSolicitud } = require('../../seguridad/models/usuarioSolicitud');

const programaSolicitudListar = async (parametros, datosUsuario) => {

    let autorizado = false;
    
    console.log(datosUsuario);

    console.log(parametros);

    const institucionId = parametros.institucionId;
    const user_id = datosUsuario.id;

    let institucion;
	try {
		institucion = await Institucion.findOne({
		    attributes: ['id', 'codigo_snies'],
		    where: {
		        id: institucionId
		    }
		});
	}
	catch (error) {
	    console.log("PROG");
	    console.log(error);
	    return res.status(400).send('error');
	}

	const institucionAdmin = await Institucion.findOne({
	            attributes: ['id', 'codigo_snies'],
	            include: [{
	                model: Usuario,
	                as: 'delegado',   
	                where: {
	                    id: user_id
	                },
	                required: true
	            }]
	        });

	if(institucion != null && institucionAdmin != null && institucionAdmin.codigo_snies == institucion.codigo_snies) {
		autorizado = true;
	}
	else {
	  	autorizado = false;
	}

    return autorizado;
}

const programaSolicitudBorrar = async (parametros, datosUsuario) => {

    let autorizado = false;
    
    console.log(datosUsuario);

    console.log(parametros);

    const programaSolcitiduId = parametros.id;
    const user_id = datosUsuario.id;

    let usuarioSolicitud;
    try {
    	usuarioSolicitud = await UsuarioSolicitud.findOne({
            attributes: ['id', 'programa_id'],
            include: [{
		        model: Programa,
		        as: 'programa',
		        attributes: ['id', 'institucion_id']
            }],
           	where: [{
               	id: programaSolcitiduId
           	}],
        });

    }
    catch (error) {
        console.log("PROG");
        console.log(error);
        return res.status(400).send('error');
    }

	if(usuarioSolicitud) {

		const institucionId = usuarioSolicitud['programa']['institucion_id'];

		let institucion;
		try {
			institucion = await Institucion.findOne({
			    attributes: ['id', 'codigo_snies'],
			    where: {
			        id: institucionId
			    }
			});
		}
	    catch (error) {
	        console.log("PROG");
	        console.log(error);
	        return res.status(400).send('error');
	    }

	    const institucionAdmin = await Institucion.findOne({
	            attributes: ['id', 'codigo_snies'],
	            include: [{
	                model: Usuario,
	                as: 'delegado',   
	                where: {
	                    id: user_id
	                },
	                required: true
	            }]
	        });

		if(institucion != null && institucionAdmin != null && institucionAdmin.codigo_snies == institucion.codigo_snies) {
	  		autorizado = true;
		}
		else {
		  	autorizado = false;
		}
	}
	else {
	  	autorizado = false;
	}

    return autorizado;
}


module.exports = {
	programaSolicitudListar: programaSolicitudListar,
	programaSolicitudBorrar: programaSolicitudBorrar,
}