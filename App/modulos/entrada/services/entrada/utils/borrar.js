const { Entrada } = require('../../../models/entrada');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Entrada borrar la: "+req.params.id);

    let entrada;
    try {
        entrada = await Entrada.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Banner.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        entrada: entrada
    });
}

module.exports = {
    borrar: borrar
}