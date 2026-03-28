const { FavoritoUsuario } = require('../../../../seguridad/models/favoritoUsuario');
const { Programa } = require('../../../models/programa');
const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;

    let programaFavorito;
    try {
            programaFavorito = await FavoritoUsuario.findAll({
                attributes: ['id', 'fecha', 'usuario_id', 'programa_id'],
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido', 'email'],
                },
                {
                    model: Programa,
                    as: 'programa',
                    attributes: ['id', 'nombre', 'nivel_academico', 'codigo_snies'],
                    include: [{
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id', 'nombre'],
                        required: true
                    }],
                    required: true
                }],
                where: {
                    usuario_id: user_id
                },
                order: [['fecha', 'DESC']],
                offset: parseInt(desde), 
                limit: parseInt(cuantos)
            });
    }
    catch (error) {
            console.log("PERD");
            console.log(error);
            return res.status(400).send('error');
    }

    let programaFavoritoTotal;
    try {
            programaFavoritoTotal = await FavoritoUsuario.findAndCountAll({
                attributes: ['id', 'fecha', 'usuario_id', 'programa_id'],
                where: {
                    usuario_id: user_id
                }
            });
    }
    catch (error) {
            console.log("PERD");
            console.log(error);
            return res.status(400).send('error');
    }

    let total = programaFavoritoTotal.count;

        res.send({
            total: total, 
            favoritos: programaFavorito
        });
}

module.exports = {
    listar: listar
}