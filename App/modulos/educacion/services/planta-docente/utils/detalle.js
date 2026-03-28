const { PlantaDocente } = require('../../../models/plantaDocente');
const { Institucion } = require('../../../models/institucion');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let plantaDocente;

        try {
            plantaDocente = await PlantaDocente.findOne({
                attributes: ['id', 'institucion_id', 'anno', 'nivel_formacion_docente_id', 'tiempo_dedicacion_id', 
                                'cantidad_hombres', 'cantidad_mujeres', 'cantidad_total'],
                include: [{
                    model: Institucion,
                    as: 'institucion',
                    attributes: ['id', 'nombre'],
                }],
                where: [{
                    id: id
                }]
            });
        }
        catch (error) {
            console.log("PROG");
            console.log(error);
            return res.status(400).send('error');
        }

    res.send({
        plantaDocente: plantaDocente
    });
}

module.exports = {
    detalle: detalle
}