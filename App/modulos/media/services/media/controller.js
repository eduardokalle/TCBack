const { listar } = require('./utils/listar');
const { upload } = require('./utils/upload');
const { borrar } = require('./utils/borrar');

const archivos_lista = async (req, res) => {
    listar(req, res);
}

const archivos_upload = async (req, res) => {
	upload(req, res);
}

const archivos_borrar = async (req, res) => {
	borrar(req, res);
}

module.exports = {
    listar: archivos_lista,
    upload: archivos_upload,
    borrar: archivos_borrar,
}