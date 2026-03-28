const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const crear = async (req, res) => {

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
    }
    else {
        
        let datoCurioso;
        let valido = true;

        if(ciudad != '') {
            departamento = null;
            nucleo = null;
        }
        else if(departamento != '') {
            ciudad = null;
            nucleo = null;
        }
        else if(nucleo != '') {
            ciudad = null;
            departamento = null;
        }
        else {
            valido = false;
        }

        if(valido == true) {

            try {
              	datoCurioso = await DatoCurioso.create({
                                texto: texto,
                                ciudad_id: ciudad,
                                departamento_id: departamento,
                                nucleo_conocimiento_id: nucleo
                });
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
    crear: crear
}
