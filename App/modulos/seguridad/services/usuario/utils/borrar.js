const { Usuario } = require('../../../models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log("Usuario borrar");

    console.log(req.params.id);

    let usuario;

    try {
        usuario = await Usuario.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Usuario");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        usuario: usuario
    });
}

module.exports = {
    borrar: borrar
}