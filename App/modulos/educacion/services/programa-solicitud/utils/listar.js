const { Programa } = require('../../../models/programa');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { UsuarioSolicitud } = require('../../../../seguridad/models/usuarioSolicitud');
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
    const institucionId = req.params.institucionId;

    let institucionAdmin;
    
    try {
        institucionAdmin = await Institucion.findOne({
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
    }
    catch (error) {
        console.log("SOLC");
        console.log(error);
        return res.status(400).send('error');
    }

    console.log("--------- LNG ----------");

    if(institucionAdmin != null) {

        const codigo_snies = institucionAdmin.codigo_snies;

        let programaSolicitud;
        try {
            programaSolicitud = await UsuarioSolicitud.findAll({
                attributes: ['id', 'fecha', 'usuario_id', 'programa_id'],
                include: [{
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'apellido', 'email', 'fecha_nacimiento'],
                },
                {
                    model: Programa,
                    as: 'programa',
                    attributes: ['id', 'nombre', 'nivel_academico', 'codigo_snies'],
                    include: [{
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id', 'nombre'],
                        where: {
                            codigo_snies: codigo_snies
                        },
                        required: true
                    }],
                    required: true
                }],
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

        let programaSolicitudTotal;
        try {
            programaSolicitudTotal = await UsuarioSolicitud.findAndCountAll({
                attributes: ['id', 'fecha', 'usuario_id', 'programa_id'],
                include: [{
                    model: Programa,
                    as: 'programa',
                    attributes: ['id', 'nombre', 'nivel_academico', 'codigo_snies'],
                    include: [{
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id', 'nombre'],
                        where: {
                            codigo_snies: codigo_snies
                        },
                        required: true
                    }]
                }],
            });
        }
        catch (error) {
            console.log("PERD");
            console.log(error);
            return res.status(400).send('error');
        }

        let total = programaSolicitudTotal.count;

        res.send({
            total: total, 
            solicitudes: programaSolicitud
        });
    }
}

module.exports = {
    listar: listar
}