const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    let usuario;
    try {
        usuario = await Usuario.update(
            { 
                institucion_id: null,
                rol_id: 3
             },
            { where: { id: req.params.id } }
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
    borrar: borrar
}