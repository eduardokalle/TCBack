const { Institucion } = require('../models/institucion');
const { Programa } = require('../models/programa');
const { ProgramaPeriodo } = require('../models/programaPeriodo');
const { Usuario } = require('../../seguridad/models/usuario');

const programaPeriodoListar = async (parametros, datosUsuario) => {

    let autorizado = false;
    
    console.log(datosUsuario);

    console.log(parametros);

    const programaId = parametros.programaId;
    const user_id = datosUsuario.id;

    let programa;
    try {
        programa = await Programa.findOne({
            attributes: ['id', 'institucion_id'],
            where: [{
                id: programaId
            }]
        });
    }
    catch (error) {
        console.log("PROG");
        console.log(error);
        return res.status(400).send('error');
    }

	if(programa) {

		const institucionId = programa['institucion_id'];

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

const programaPeriodoEditar = async (parametros, datosUsuario) => {
	
	let autorizado = false;
    
    console.log(datosUsuario);

    console.log(parametros);

    const programaPeriodoId = parametros.id;
    const user_id = datosUsuario.id;

    let programaPeriodo;

    try {
    	programaPeriodo = await ProgramaPeriodo.findOne({
	            attributes: ['id', 'programa_id'],
	            where: [{
	                id: programaPeriodoId
	            }]
	        });
    }
    catch (error) {
    	console.log("PROG");
		console.log(error);
		return res.status(400).send('error');
    }

    if(programaPeriodo) {

    	const programaId = programaPeriodo['programa_id'];

	    let programa;
	    try {
	        programa = await Programa.findOne({
	            attributes: ['id', 'institucion_id'],
	            where: [{
	                id: programaId
	            }]
	        });
	    }
	    catch (error) {
	        console.log("PROG");
	        console.log(error);
	        return res.status(400).send('error');
	    }

		if(programa) {

			const institucionId = programa['institucion_id'];

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
    }
    else {
	  	autorizado = false;
	}

    return autorizado;
}



module.exports = {
	programaPeriodoListar: programaPeriodoListar,
	programaPeriodoCrear: programaPeriodoListar,
	programaPeriodoEditar: programaPeriodoEditar,
	programaPeriodoBorrar: programaPeriodoEditar,
}