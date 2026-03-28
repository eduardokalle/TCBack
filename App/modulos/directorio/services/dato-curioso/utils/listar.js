const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { NucleoConocimiento } = require('../../../../educacion/models/nucleoConocimiento')
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;
    const institucion_id = req.params.institucionId;

    let total;
    let datoCurioso;
    let datoCuriosoTotal;

    try {
        datoCurioso = await DatoCurioso.findAll({
            attributes: ['id', 'ciudad_id', 'departamento_id', 'nucleo_conocimiento_id', 'texto'],
            include: [
            {
                model: Ciudad,
                as: 'ciudad',
                attributes: ['id', 'nombre']
            },
            {
                model: Departamento,
                as: 'departamento',
                attributes: ['id', 'nombre']
            },
            {
                model: NucleoConocimiento,
                as: 'nucleo_conocimiento',
                attributes: ['id', 'nombre']
            }
            /*
            */
            ],
            order: [['id', 'DESC']],
            offset: parseInt(desde), 
            limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("Dat. Cur");
        console.log(error);
        return res.status(400).send('error');
    }

    try {
        datoCuriosoTotal = await DatoCurioso.findAndCountAll({
            attributes: ['id'],
        });
        console.log("ENTRA POR EL TRY");
    }
    catch (error) {
        console.log("Dat. Cur");
        console.log(error);
        return res.status(400).send('error');
    }
    total = datoCuriosoTotal.count;

    res.send({
        total: total, 
        datoCurioso: datoCurioso
    });
}

module.exports = {
    listar: listar
}