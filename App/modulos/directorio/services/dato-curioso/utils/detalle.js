const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let datoCurioso;

        try {
            datoCurioso = await DatoCurioso.findOne({
                attributes: ['id', 'ciudad_id', 'departamento_id', 'nucleo_conocimiento_id', 'texto'],
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
        datoCurioso: datoCurioso
    });
}

module.exports = {
    detalle: detalle
}