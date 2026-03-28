const { Archivo } = require('../../../models/archivo');
const { Sequelize } = require('../../../../../config');
const Op = Sequelize.Op;

const listar = async (req, res) => {

	const data = {};

    const page = req.params.page;
    const cuantos = 40;
    const desde = (cuantos*page)-cuantos;
    
    const filter = req.params.filter;

    const whereArchivo = {};
    whereArchivo.usuario_id = req.body.user_id

    if(filter != 'nn' && filter != '') {
        whereArchivo.url = { [Op.like]: `%${filter}%` };
    }

    const attributes = {
        attributes: ['id', 'url'],
        order: [['id', 'DESC']],
        where: whereArchivo,
        offset: parseInt(desde), 
        limit: parseInt(cuantos)
    }

    const archivos = await Archivo.findAll(attributes);

    res.send(archivos);
}


module.exports = {
    listar: listar
}