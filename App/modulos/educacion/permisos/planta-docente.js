const { Institucion } = require('../models/institucion');
const { Programa } = require('../models/programa');
const { PlantaDocente } = require('../models/plantaDocente');
const { Usuario } = require('../../seguridad/models/usuario');

const plantaDocenteCrear = async (parametros, datosUsuario) => {

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
	  	autorizado = true;
	}
	else {
	  	autorizado = false;
	}

    return autorizado;
}

const plantaDocenteEditar = async (parametros, datosUsuario) => {
	let autorizado = false;
    
    console.log(parametros);

    const plantaDocenteId = parametros.id;
    const user_id = datosUsuario.id;

    let plantaDocente;
    try {
	    plantaDocente = await PlantaDocente.findOne({
	    	attributes: ['id', 'institucion_id'],
	    	where: {
	    		id: plantaDocenteId,
	    	}
	    });
    }
    catch (error) {
        console.log(" Inst");
        console.log(error);
        return res.status(400).send('error');
    }

    const institucionId = plantaDocente.institucion_id;

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
	plantaDocenteCrear: plantaDocenteCrear,
	plantaDocenteEditar: plantaDocenteEditar,
	plantaDocenteBorrar: plantaDocenteEditar
}