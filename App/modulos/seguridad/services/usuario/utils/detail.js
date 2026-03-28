
const { Usuario } = require('../../../models/usuario');
const { Rol } = require('../../../models/rol');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const detail = async (req, res) => {

    let id = req.params.id;

    if(id == 0) {
        id = req.body.user_id;
    }

    let usuario;
    
    try {
        usuario = await Usuario.findOne({
            attributes: ['id', 'ciudad_id', 'rol_id', 'institucion_id', 'nombre', 'apellido', 'alias', 
							'email', 'estado', 'fecha_nacimiento', 'fecha_registro', 'celular'],
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
            where: [{
                id: id
            }]
        });
    }
    catch (error) {
        console.log("User");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        usuario: usuario,
    });
}

module.exports = {
    detail: detail
}