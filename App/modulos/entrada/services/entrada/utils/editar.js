const { Entrada } = require('../../../models/entrada');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const editar = async (req, res) => {

    const entradaId = req.params.id;

    let titulo = req.body.titulo;
    let resumen = req.body.resumen;
    let texto = req.body.texto;
    let fecha = req.body.fecha;
    let imagenId = req.body.imagenFileId;
    let categoria = req.body.categoria;
    let tipo = req.body.tipo;
    let destacada = req.body.destacada;
    const palabrasClave = req.body.palabrasClave;
    
    const schema = {
        titulo: joi.string().required(),
        imagenId: joi.number().integer().required(),
        resumen: joi.allow('').allow(null),
        texto: joi.string().required(),
        fecha: joi.string().regex(/^(\d{4})-((0[1-9])|(1[0-2]))-(0[1-9]|[12][0-9]|3[01])$/).required(),
        categoria: joi.number().integer().required(),
        tipo: joi.number().integer().required(),
        destacada: joi.number().integer().valid(0, 1).required()
    };

    const { error, value } = joi.validate({ titulo,
                                            imagenId,
                                            resumen,
                                            texto,
                                            fecha,
                                            categoria,
                                            tipo,
                                            destacada
                                        }, schema);

    console.log(req.body);

    if(error) {
        console.log(error);
        res.status(500).send('Error de validación');
    }
    else {
        
        let entrada;

        try {
          	entrada = await Entrada.update(
                {
                    titulo: titulo,
                    resumen: resumen,
                    texto: texto,
                    fecha: fecha,
                    imagen_id: imagenId,
                    entrada_tipo_id: tipo,
                    entrada_categoria_id: categoria,
                    destacada: destacada,
                    palabrasClave
                },
                { where: { id: entradaId } }
            );
        }
        catch (error) {
            console.log("Banner");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            entrada: entrada
        });
    }

}

module.exports = {
    editar: editar
}
