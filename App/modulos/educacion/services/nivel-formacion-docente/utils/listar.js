const { NivelFormacionDocente } = require('../../../models/nivelFormacionDocente');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    let nivelFormacionDocente;
    try {
        nivelFormacionDocente = await NivelFormacionDocente.findAll({
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
        nivelFormacionDocente: nivelFormacionDocente
    });
}

module.exports = {
    listar: listar
}