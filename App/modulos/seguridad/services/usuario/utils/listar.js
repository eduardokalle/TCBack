const { Usuario } = require('../../../models/usuario');
const { Rol } = require('../../../models/rol');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

	const desde = req.params.desde;
    const cuantos = req.params.cuantos;

    let usuario;
    let usuarioTotal;

    try {
        usuario = await Usuario.findAll({
            attributes: ['id', 'ciudad_id', 'rol_id', 'institucion_id', 'nombre', 'apellido', 'alias', 
							'email', 'estado', 'fecha_nacimiento', 'fecha_registro', 'celular' ],
			include: [{
                    model: Ciudad,
                    as: 'ciudad',
                    attributes: ['id', 'nombre'],
                    include: [{
                        model: Departamento,
                        as: 'departamento',
                        attributes: ['id', 'nombre', 'region_id']
                    }],
				},
				{
					model: Rol,
					as: 'rol',
					attributes: ['id', 'nombre']
				}],
            order: [['nombre', 'ASC'], ['apellido', 'ASC']],
            offset: parseInt(desde), 
			limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("User");
        console.log(error);
        return res.status(400).send('error');
    }

    try {
		usuarioTotal = await Usuario.findAndCountAll({
			attributes: ['id' ]
		});
	}
	catch (error) {
		console.log("User total");
		console.log(error);
		return res.status(400).send('error');
	}

    res.send({
        usuario: usuario,
        usuarioTotal: usuarioTotal.count
    });
    
}

module.exports = {
    listar: listar
}