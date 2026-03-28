const { PlantaDocente } = require('../../../models/plantaDocente');
const { NivelFormacionDocente } = require('../../../models/nivelFormacionDocente');
const { TiempoDedicacion } = require('../../../models/tiempoDedicacion');
const { Institucion } = require('../../../models/institucion');

const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;
    const institucion_id = req.params.institucionId;

    let total;
    let institucion;
    let plantaDocente;
    let plantaDocenteTotal;

    try {
        institucion = await Institucion.findAll({
            attributes: ['id', 'nombre'],
            where: {
                id: institucion_id
            }
        });
    }
    catch (error) {
        console.log("DOCE");
        console.log(error);
        return res.status(400).send('error');
    }

    try {
        plantaDocente = await PlantaDocente.findAll({
            attributes: ['id', 'institucion_id', 'anno', 'nivel_formacion_docente_id', 'tiempo_dedicacion_id', 
                            'cantidad_hombres', 'cantidad_mujeres', 'cantidad_total'],
            include: [{
                    model: TiempoDedicacion,
                    as: 'tiempo_dedicacion',
                    attributes: ['id', 'nombre'],
                },
                {
                    model: NivelFormacionDocente,
                    as: 'nivel_formacion_docente',
                    attributes: ['id', 'nombre'],
                    
                }],
            where: {
                institucion_id: institucion_id
            },
            order: [['anno', 'DESC']],
            offset: parseInt(desde), 
            limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("DOCE");
        console.log(error);
        return res.status(400).send('error');
    }
    

    try {
        plantaDocenteTotal = await PlantaDocente.findAndCountAll({
            attributes: ['id'],
            where: {
                institucion_id: institucion_id
            }
        });
    }
    catch (error) {
        console.log("DOCE");
        console.log(error);
        return res.status(400).send('error');
    }
    total = plantaDocenteTotal.count;

    res.send({
        institucion: institucion[0],
        total: total, 
        plantaDocente: plantaDocente,
    });
}

module.exports = {
    listar: listar
}