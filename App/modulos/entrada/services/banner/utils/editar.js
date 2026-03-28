const { Banner } = require('../../../models/banner');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const editar = async (req, res) => {

    const bannerId = req.params.id;

    let titulo = req.body.titulo;
    let imagenFileId = req.body.imagenFileId;
    let link = req.body.link;
    let estado = req.body.estado;
    const palabrasClave = req.body.palabrasClave;
    
    const schema = {
        imagenFileId: joi.number().integer().required(),
        titulo: joi.string().required(),
    };

    const { error, value } = joi.validate({ titulo,
                                            imagenFileId
                                        }, schema);

    console.log(req.body);

    if(error) {
        res.status(500).send('Error de validación');
    }
    else {
        
        let banner;

        try {
          	banner = await Banner.update({
                    titulo: titulo,
                    imagen_id: imagenFileId,
                    link: link,
                    estado: estado,
                    palabrasClave
                },
                { where: { id: bannerId } }
            );
        }
        catch (error) {
            console.log("Banner");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            banner: banner
        });
    }

}

module.exports = {
    editar: editar
}
