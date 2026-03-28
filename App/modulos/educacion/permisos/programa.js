const { Institucion } = require('../models/institucion');
const { Programa } = require('../models/programa');
const { Usuario } = require('../../seguridad/models/usuario');

const programaCrear = async (parametros, datosUsuario) => {

    let autorizado = false;
    
    console.log(datosUsuario);

    console.log(parametros);

    const id = parametros.institucionId;
    const user_id = datosUsuario.id;

	const institucion = await Institucion.findOne({
	    attributes: ['id', 'codigo_snies'],
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
	  	autorizado = false;
	}
	else {
	  	autorizado = false;
	}

    return autorizado;
}

const programaEditar = async (parametros, datosUsuario) => {
	let autorizado = false;
    
    console.log(parametros);

    const programaId = parametros.id;
    const user_id = datosUsuario.id;

    let programa;
    try {
	    programa = await Programa.findOne({
	    	attributes: ['id', 'institucion_id'],
	    	where: {
	    		id: programaId,
	    	}
	    });
    }
    catch (error) {
        console.log(" Inst");
        console.log(error);
        return res.status(400).send('error');
    }

    const institucionId = programa.institucion_id;

    if(institucionId) {
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
	        console.log(" Inst");
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


    return autorizado;
}

module.exports = {
	programaCrear: programaCrear,
	programaEditar: programaEditar,
	programaBorrar: programaEditar
}