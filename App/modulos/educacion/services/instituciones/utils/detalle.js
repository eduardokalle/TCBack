const { Caracter } = require('../../../models/caracter');
const { Naturaleza } = require('../../../models/naturaleza');
const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let institucion;
    
    try {
        institucion = await Institucion.findOne({
            attributes: ['id', 'ciudad_id', 'caracter_id', 'naturaleza_id', 'codigo_snies', 'nombre', 'estado', 'sector', 
                        'acreditacion', 'es_principal', 'sede_titular', 'fecha_registro', 'telefono_contacto', 'direccion_domicilio',
                        'programas_vigentes', 'fecha_acreditacion', 'resolucion_acreditacion', 'vigencia_acreditacion', 
                        'ruta_logo', 'url_web' ],
            include: [{
                            model: Ciudad,
                            as: 'ciudad',
                            attributes: ['id', 'nombre'],
                            include: [{
                                model: Departamento,
                                as: 'departamento',
                                attributes: ['id', 'nombre', 'region_id']
                            }],
                        },
                        {
                            model: Archivo,
                            as: 'imagen',
                            attributes: ['id', 'url']
                }],
            where: [{
                id: id
            }]
        });
    }
    catch (error) {
        console.log(" Inst");
        console.log(error);
        return res.status(400).send('error');
    }


    let itemInstitucion = JSON.parse(JSON.stringify(institucion));

    if(itemInstitucion['imagen']) {
        itemInstitucion.ruta_logo = serverURL+itemInstitucion['imagen']['url'];
        itemInstitucion.imagen_id = itemInstitucion['imagen']['id'];
    }


    let caracter;
    try {
        caracter = await Caracter.findAll({
            attributes: ['id', 'nombre', 'estado'],
        });
    }
    catch (error) {
        console.log(" Carc");
        console.log(error);
        return res.status(400).send('error');
    }
    

    let naturaleza;
    try {
        naturaleza = await Naturaleza.findAll({
            attributes: ['id', 'nombre', 'estado'],
        });
    }
    catch (error) {
        console.log(" Natr");
        console.log(error);
        return res.status(400).send('error');
    }
    

    res.send({
        //institucion: institucion,
        institucion: itemInstitucion,
        caracter: caracter,
        naturaleza: naturaleza
    });
}

module.exports = {
    detalle: detalle
}