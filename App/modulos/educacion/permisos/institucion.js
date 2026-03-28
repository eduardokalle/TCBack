const { Institucion } = require('../models/institucion');
const { Usuario } = require('../../seguridad/models/usuario');

const institucionEditar = async (parametros, datosUsuario) => {

    let autorizado = false;
    
    console.log(datosUsuario);

    const id = parametros.id;
    const user_id = datosUsuario.id;

	const institucion = await Institucion.findOne({
	    attributes: ['id', 'codigo_snies'],
	    /*include: [{
            model: Usuario,
            as: 'delegado',
            where: {
            	id: user_id
            },
        	required: true
		}],*/
		where: {
	        id: id
	    }
	});

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

module.exports = {
	institucionEditar: institucionEditar
}