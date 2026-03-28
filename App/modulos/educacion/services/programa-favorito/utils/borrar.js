const { FavoritoUsuario } = require('../../../../seguridad/models/favoritoUsuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Programa favorito borrar el: "+req.params.id);

    let programaFavorito;
    try {
        programaFavorito = await FavoritoUsuario.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Prg. Fav.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        programaFavorito: programaFavorito
    });
}

module.exports = {
    borrar: borrar
}