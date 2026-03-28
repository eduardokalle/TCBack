const { Archivo } = require('../../../models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
var path = require('path');
var appDir = path.dirname(require.main.filename);

const Op = Sequelize.Op;

const upload = async (req, res) => {

	const data = {};

    const file =  req.files.file;
    const random = [...Array(5)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

    console.log("DIR DE CARGA: ==========>")
    console.log(appDir);

    file.mv(appDir+'/uploads/'+random+'_'+file.name);

    const archivo = await Archivo.create({
                usuario_id: req.body.user_id,
                url: random+'_'+file.name,
            });

    imageUrl = serverURL+random+'_'+file.name;
    data.imageUrl = imageUrl;

    res.send(data);
}


module.exports = {
    upload: upload
}