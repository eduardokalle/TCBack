const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const crear = async (req, res) => {

    let nombre = req.body.nombre;
    let ciudad = req.body.ciudad;
    let caracter = req.body.caracter;
    let naturaleza = req.body.naturaleza;
    let codigoSnies = req.body.codigoSnies;
    let direccionDomicilio = req.body.direccionDomicilio;
    let urlWeb = req.body.urlWeb;
    let telefonoContacto = req.body.telefonoContacto;
    let fechaRegistro = req.body.fechaRegistro;
    let sector = req.body.sector;
    let fechaAcreditacion = req.body.fechaAcreditacion;
    let vigenciaAcreditacion = req.body.vigenciaAcreditacion;
    let resolucionAcreditacion = req.body.resolucionAcreditacion;
    let programasVigentes = req.body.programasVigentes;
    let esPrincipal = req.body.esPrincipal;
    let sedeTitular = req.body.sedeTitular;
    let imagen_id = req.body.imagenFileId;
    let acreditacion = req.body.acreditacion;
    let rutaLogo = req.body.rutaLogo;

    const schema = {
        //nombre: joi.string().required(),
        ciudad: joi.number().integer().required(),
        //caracter: joi.number().integer().required(),
        //naturaleza: joi.number().integer().required(),
        codigoSnies: joi.string().required(),
        //sector: joi.string().valid('PRIVADA', 'OFICIAL').insensitive().required(),
        //acreditacion: joi.number().integer().valid(0,1).required(),
        //esPrincipal: joi.number().integer().valid(0,1).required(),
        sedeTitular: joi.number().integer().valid(0,1).required(),
        //fechaRegistro: joi.string().regex(/^(\d{4})-((0[1-9])|(1[0-2]))-(0[1-9]|[12][0-9]|3[01])$/).required(),
        //direccionDomicilio: joi.string().required(),
        //programasVigentes: joi.number().integer().required(),
        //fechaAcreditacion: joi.string().regex(/^(\d{4})-((0[1-9])|(1[0-2]))-(0[1-9]|[12][0-9]|3[01])$/).allow(['', null]),
        //resolucionAcreditacion: joi.string().allow(['', null]),
        //vigenciaAcreditacion: joi.number().integer().allow(['', null]),
    };


    const { error, value } = joi.validate({ ciudad,
                                            //caracter,
                                            //naturaleza,
                                            codigoSnies,
                                            //nombre,
                                            //sector, 
                                            //acreditacion,
                                            //esPrincipal,
                                            sedeTitular,
                                            //fechaRegistro,
                                            //direccionDomicilio,
                                            //programasVigentes,
                                            //fechaAcreditacion,
                                            //resolucionAcreditacion,
                                            //vigenciaAcreditacion,
                                        }, schema);

    if(error) {
        console.log(error);
        res.status(500).send('Error de validación');
    }
    else {
        console.log(req.body);

        nombre = (nombre === '')? null : nombre;
        ciudad = (ciudad === '')? null : ciudad;
        caracter = (caracter === '')? null : caracter;
        naturaleza = (naturaleza === '')? null : naturaleza;
        codigoSnies = (codigoSnies === '')? null : codigoSnies;
        direccionDomicilio = (direccionDomicilio === '')? null : direccionDomicilio;
        urlWeb = (urlWeb === '')? null : urlWeb;
        telefonoContacto = (telefonoContacto === '')? null : telefonoContacto;
        fechaRegistro = (fechaRegistro === '')? null : fechaRegistro;
        sector = (sector === '')? null : sector;
        fechaAcreditacion = (fechaAcreditacion === '')? null : fechaAcreditacion;
        vigenciaAcreditacion = (vigenciaAcreditacion === '')? null : vigenciaAcreditacion;
        resolucionAcreditacion = (resolucionAcreditacion === '')? null : resolucionAcreditacion;
        programasVigentes = (programasVigentes === '')? null : programasVigentes;
        esPrincipal = (esPrincipal === '')? null : esPrincipal;
        sedeTitular = (sedeTitular === '')? null : sedeTitular;
        imagen_id = (imagen_id === '')? null : imagen_id;
        acreditacion = (acreditacion === '')? null : acreditacion;
        rutaLogo = (rutaLogo === '')? null : rutaLogo;

        let institucion;

        try {
            const institucion = await Institucion.create({
                        ciudad_id: ciudad, 
                        caracter_id: caracter, 
                        naturaleza_id: naturaleza,
                        imagen_id: imagen_id,
                        codigo_snies: codigoSnies, 
                        nombre: nombre, 
                        sector: sector, 
                        acreditacion: acreditacion,
                        es_principal: esPrincipal, 
                        sede_titular: sedeTitular,
                        fecha_registro: fechaRegistro, 
                        telefono_contacto: telefonoContacto,
                        direccion_domicilio: direccionDomicilio, 
                        programas_vigentes: programasVigentes, 
                        fecha_acreditacion: fechaAcreditacion, 
                        resolucion_acreditacion: resolucionAcreditacion,
                        vigencia_acreditacion: vigenciaAcreditacion, 
                        url_web: urlWeb
            });
        }
        catch (error) {
            console.log(" Inst");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            institucion: institucion
        });
    }
}

module.exports = {
    crear: crear
}