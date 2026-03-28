const { UsuarioSolicitud } = require('../../../../seguridad/models/usuarioSolicitud');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Programa solicitud borrar el: "+req.params.id);

    let usuarioSolicitud;
    try {
        usuarioSolicitud = await UsuarioSolicitud.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Prg. Solc.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        usuarioSolicitud: usuarioSolicitud
    });
}

module.exports = {
    borrar: borrar
}