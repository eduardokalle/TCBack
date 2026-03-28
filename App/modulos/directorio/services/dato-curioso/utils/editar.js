const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const editar = async (req, res) => {

    const datoCuriosoId = req.params.id;

    console.log("Dato curiso editar el: "+datoCuriosoId);
    let texto = req.body.texto;
    let ciudad = req.body.ciudad;
    let departamento = req.body.departamento;
    let nucleo = req.body.nucleo;
    
    const schema = {
        texto: joi.string().required(),
    };

    const { error, value } = joi.validate({ texto
                                        }, schema);

    console.log(req.body);

    if(error) {
        res.status(500).send('Error de validación');
        console.log(error);
    }
    else {
        
        let datoCurioso;
        let valido = true;

        if(ciudad != null) {
            departamento = null;
            nucleo = null;
        }
        else if(departamento != null) {
            ciudad = null;
            nucleo = null;
        }
        else if(nucleo != null) {
            ciudad = null;
            departamento = null;
        }
        else {
            valido = false;
        }

        if(valido == true) {
            try {
                datoCurioso = await DatoCurioso.update({
                                texto: texto,
                                ciudad_id: ciudad,
                                departamento_id: departamento,
                                nucleo_conocimiento_id: nucleo

                            },
                            { where: { id: datoCuriosoId } }
                );
            }
            catch (error) {
                console.log("Doce");
                console.log(error);
                return res.status(400).send('error');
            }

            res.send({
                datoCurioso: datoCurioso
            });
        }

    }
}

module.exports = {
    editar: editar
}