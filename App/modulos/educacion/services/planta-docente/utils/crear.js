const { PlantaDocente } = require('../../../models/plantaDocente');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const crear = async (req, res) => {


    let anno = req.body.anno;
    let cantidadHombres = req.body.cantidadHombres;
    let cantidadMujeres = req.body.cantidadMujeres;
    let institucionId = req.body.institucion;
    let nivelFormacionDocente = req.body.nivelFormacionDocente;
    let tiempoDedicacion = req.body.tiempoDedicacion;
    
    const schema = {
        institucionId: joi.number().integer().required(),
        anno: joi.number().integer().required(),
        cantidadHombres: joi.number().integer().required(),
        cantidadMujeres: joi.number().integer().required(),
        nivelFormacionDocente: joi.number().integer().required(),
        tiempoDedicacion: joi.number().integer().required()
    };

    const { error, value } = joi.validate({ institucionId,
                                            anno,
                                            cantidadHombres,
                                            cantidadMujeres,
                                            nivelFormacionDocente,
                                            tiempoDedicacion
                                        }, schema);

    console.log(req.body);

    if(error) {
        res.status(500).send(error);
    }
    else {
        
        let plantaDocente;

        let cantidadTotal = cantidadHombres + cantidadMujeres;

        try {
          	plantaDocente = await PlantaDocente.create({
                institucion_id: institucionId,
                anno: anno,
                hombres: cantidadHombres,
                mujeres: cantidadMujeres,
                total: cantidadTotal,
                nivel_formacion_docente_id: nivelFormacionDocente,
                tiempo_dedicacion_id: tiempoDedicacion
            });
        }
        catch (error) {
            console.log("Planta docente");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            plantaDocente: plantaDocente
        });
    }

}

module.exports = {
    crear: crear
}
