const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Dato curiso borrar el: "+req.params.id);

    let datoCurioso;
    try {
        datoCurioso = await DatoCurioso.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Prg. Perd.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        datoCurioso: datoCurioso
    });
}

module.exports = {
    borrar: borrar
}