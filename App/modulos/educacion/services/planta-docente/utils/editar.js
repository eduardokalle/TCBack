const { PlantaDocente } = require('../../../models/plantaDocente');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const editar = async (req, res) => {

    let plantaDocenteId = req.params.id;

    let anno = req.body.anno;
    let cantidadHombres = req.body.cantidadHombres;
    let cantidadMujeres = req.body.cantidadMujeres;
    let institucionId = req.body.institucion;
    let nivelFormacionDocente = req.body.nivelFormacionDocente;
    let tiempoDedicacion = req.body.tiempoDedicacion;

    console.log("Planta docente editar el: "+plantaDocenteId);

    const schema = {
        plantaDocenteId: joi.number().integer().required(),
        institucionId: joi.number().integer().required(),
        anno: joi.number().integer().required(),
        cantidadHombres: joi.number().integer().required(),
        cantidadMujeres: joi.number().integer().required(),
        nivelFormacionDocente: joi.number().integer().required(),
        tiempoDedicacion: joi.number().integer().required()
    };

    const { error, value } = joi.validate({ plantaDocenteId,
                                            institucionId,
                                            anno,
                                            cantidadHombres,
                                            cantidadMujeres,
                                            nivelFormacionDocente,
                                            tiempoDedicacion
                                        }, schema);

    if(error) {
        res.status(500).send('Error de validación');
        console.log(error);
    }
    else {
        
        let plantaDocente;

        let cantidadTotal = cantidadHombres + cantidadMujeres;

        try {
            plantaDocente = await PlantaDocente.update(
                        {
                            institucion_id: institucionId,
                            anno: anno,
                            hombres: cantidadHombres,
                            mujeres: cantidadMujeres,
                            total: cantidadTotal,
                            nivel_formacion_docente_id: nivelFormacionDocente,
                            tiempo_dedicacion_id: tiempoDedicacion
                        },
                        { where: { id: plantaDocenteId } }
            );
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
    editar: editar
}