const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;
    const whereNombre = {};

    if(req.params.nombre != 'nn' && req.params.nombre != '') {
        whereNombre.nombre = { [Op.like]: `%${req.params.nombre}%` };
    }

    let total;
    let instituciones;
    let institucionesTotal;

    if(role_id == 1) {
        try {
        	instituciones = await Institucion.findAll({
                attributes: ['id', 'nombre', 'sector', 'ciudad_id', 'codigo_snies', 'sede_titular', 'es_principal'],
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
                where: whereNombre,
                order: [['nombre', 'ASC'], ['es_principal', 'DESC'], ['sede_titular', 'DESC']],
                offset: parseInt(desde), 
                limit: parseInt(cuantos)
            });
        }
        catch (error) {
            console.log(" Inst");
            console.log(error);
            return res.status(400).send('error');
        }

        try {
            institucionesTotal = await Institucion.findAndCountAll({
                attributes: ['id'],
                where: whereNombre,
            });
        }
        catch (error) {
            console.log(" Inst");
            console.log(error);
            return res.status(400).send('error');
        }

        total = institucionesTotal.count;
    }
    else {

        total = 0;

        let principal;

        try {
            principal = await Institucion.findOne({
                attributes: ['id', 'codigo_snies'],
                include: [{
                    model: Usuario,
                    as: 'delegado',   
                    where: {
                        id: user_id
                    },
                    required: true
                }]
            });

            principal
        }
        catch (error) {
            console.log("Prg");
            console.log(error);
            return res.status(400).send('error');
        }

        if(principal.length != 0) {

            try {
                instituciones = await Institucion.findAll({
                    attributes: ['id', 'nombre', 'sector', 'ciudad_id', 'codigo_snies', 'sede_titular', 'es_principal' ],
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
                    where: {
                        'codigo_snies': principal.codigo_snies
                    },
                    order: [['nombre', 'ASC'], ['es_principal', 'DESC'], ['sede_titular', 'DESC']],
                    offset: parseInt(desde), 
                    limit: parseInt(cuantos)
                });
            }
            catch (error) {
                console.log("Inst");
                console.log(error);
                return res.status(400).send('error');
            }

            try {
                institucionesTotal = await Institucion.findAndCountAll({
                    attributes: ['id'],
                    where: {
                        'codigo_snies': principal.codigo_snies
                    }
                });
            }
            catch (error) {
                console.log("Prg");
                console.log(error);
                return res.status(400).send('error');
            }

            total = institucionesTotal.count;
        }
    }

    let data = [];
    let ruta_logo;
    let imagen_id;
    for (const i in instituciones) {

        ruta_logo = '';
        imagen_id = '';
        if(instituciones[i].imagen) {
            ruta_logo = serverURL+instituciones[i].imagen.url;
            imagen_id = instituciones[i].imagen.id;
        }

        data.push({
            id: instituciones[i].id,
            nombre: `${ instituciones[i].nombre } sede ${ instituciones[i].ciudad.nombre }`,
            sector: instituciones[i].sector,
            municipio: instituciones[i].ciudad.id,
            departamento: instituciones[i].ciudad.departamento.id,
            region: instituciones[i].ciudad.departamento.region_id,
            delegado: instituciones[i].delegado,
            codigo_snies: instituciones[i].codigo_snies,
            ruta_logo: ruta_logo,
            imagen_id: imagen_id,
            es_principal: instituciones[i].es_principal,
            sede_titular: instituciones[i].sede_titular,
        });
    }

    res.send({
        instituciones: data,
        total: total,
    });
}

module.exports = {
    listar: listar
}