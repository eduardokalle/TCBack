const { PlantaDocente } = require('../../../models/plantaDocente');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Planta docente borrar el: "+req.params.id);

    let plantaDocente;
    try {
        plantaDocente = await PlantaDocente.destroy({
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
        plantaDocente: plantaDocente
    });
}

module.exports = {
    borrar: borrar
}