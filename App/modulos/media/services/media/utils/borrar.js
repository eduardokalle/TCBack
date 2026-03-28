const { Archivo } = require('../../../models/archivo');
const { Sequelize } = require('../../../../../config');
const Op = Sequelize.Op;

const borrar = async (req, res) => {

	const data = {};

    const archivosIds = req.params.ids;

    const ids = archivosIds.split(',');
    let id;
    let archivos;

    for(let i in ids){
        id = ids[i];

        let programa;
        try {
            archivos = await Archivo.destroy({
                where: {
                    id: id
                }
            });
        }
        catch (error) {
            
            let  nombreArchivo = '';

            let archivoError = await Archivo.findOne({
                attributes: ['id', 'url'],
                where: [{
                    id: id
                }]
            });

            if(archivoError) {
                nombreArchivo = archivoError.url.substring(6);
            }

            return res.status(400).send({ error: "No se pudo borrar el archivo "+nombreArchivo });
        }
    }

    res.send(data);
}


module.exports = {
    borrar: borrar
}