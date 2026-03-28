const { TiempoDedicacion } = require('../../../models/tiempoDedicacion');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    let tiempoDedicacion;
    try {
        tiempoDedicacion = await TiempoDedicacion.findAll({
            attributes: ['id', 'nombre', 'ponderacion'],
            order: [['nombre', 'ASC']],
        });
    }
    catch (error) {
        console.log("PERD");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        tiempoDedicacion: tiempoDedicacion
    });
}

module.exports = {
    listar: listar
}