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
    let wherePrograma = {};

    wherePrograma.estado = 1;
    if(req.params.nombre != 'nn' && req.params.nombre != '') {
        //wherePrograma.nombre = { [Op.like]: `%${req.params.nombre}%` };

        wherePrograma = {
          [Op.or]: [
            {
              nombre: { [Op.like]: `%${req.params.nombre}%` }
            },
            {
              codigo_snies: { [Op.like]: `%${req.params.nombre}%` }
            }
          ]
        }


    }

    let total;
    let programas;
    let programasTotal;

    if(role_id == 1) {
        try {
            programas = await Programa.findAll({
                attributes: ['id', 'institucion_id', 'nombre', 'codigo_snies', 'titulo', 'nivel_academico'],
                include: [
                {
                    model: Institucion,
                    as: 'institucion',
                    attributes: ['id', 'nombre', 'sector', 'ciudad_id'],
                    include: [{
                        model: Ciudad,
                        as: 'ciudad',
                        attributes: ['id', 'nombre']
                    }],
                    required: true
                }],
                where: wherePrograma,
                order: [['nombre', 'ASC']],
                offset: parseInt(desde), 
                limit: parseInt(cuantos)
            });
        }
        catch (error) {
            console.log("PROG");
            console.log(error);
            return res.status(400).send('error');
        }


        try {
            programasTotal = await Programa.findAndCountAll({
                attributes: ['id'],
                where: wherePrograma
            });
        }
        catch (error) {
            console.log("PROG");
            console.log(error);
            return res.status(400).send('error');
        }

        total = programasTotal.count;
    }
    else {

        let institucionAdmin = await Institucion.findOne({
            attributes: ['id', 'codigo_snies'],
            include: [{
                model: Usuario,
                as: 'delegado',   
                where: {
                    id: user_id
                },
                required: true
            }]
        })

        const institucionId =  institucionAdmin.id;
        total = 0;
        if(institucionId) {
            try {
                programas = await Programa.findAll({
                    attributes: ['id', 'institucion_id', 'nombre', 'codigo_snies', 'titulo', 'nivel_academico'],
                    include: [{
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id', 'nombre', 'sector', 'ciudad_id'],
                        include: [{
                            model: Ciudad,
                            as: 'ciudad',
                            attributes: ['id', 'nombre']
                        }],
                        where: [{
                            codigo_snies: institucionAdmin.codigo_snies,
                        }]
                    
                    }],
                    where: [{
                        estado: 1
                    }],
                    order: [['nombre', 'ASC']],
                    offset: parseInt(desde), 
                    limit: parseInt(cuantos)
                });
            }
            catch (error) {
                console.log(" Inst");
                console.log(error);
                return res.status(400).send('error');
            }

            try {
                programasTotal = await Programa.findAndCountAll({
                    attributes: ['id', 'institucion_id'],
                    include: [{
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id'],
                        where: [{
                            codigo_snies: institucionAdmin.codigo_snies,
                        }],
                    }],
                    where: [{
                        estado: 1
                    }]
                });
            }
            catch (error) {
                console.log(" Inst");
                console.log(error);
                return res.status(400).send('error');
            }

            total = programasTotal.count;
        }
    }


    let data = [];
    for (const i in programas) {
        data.push({
            id: programas[i].id,
            nombre: programas[i].nombre,
            codigo_snies: programas[i].codigo_snies,
            titulo: programas[i].titulo,
            institucion: programas[i].institucion,
            nivel_academico: programas[i].nivel_academico,
        });
    }

    res.send({
        total: total, 
        programas: data
    });
}

module.exports = {
    listar: listar
}