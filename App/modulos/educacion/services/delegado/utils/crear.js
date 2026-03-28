const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const crear = async (req, res) => {

    let usuario;
    
    console.log(req.body);

    try {
        usuario = await Usuario.update(
            { institucion_id: req.body.institucionId },
            { where: { id: req.body.usuarioId } }
        )
    }
    catch (error) {
        console.log(" Inst");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        usuario: usuario
    });
}

module.exports = {
    crear: crear
}