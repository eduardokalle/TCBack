const { oferta } = require('./utils/oferta');
const { filtros } = require('./utils/filtros');
const { favorito } = require('./utils/favorito');
const { solicitud } = require('./utils/solicitud');
const { programa } = require('./utils/programa');

const oferta_lista = async (req, res) => {
    oferta(req.body, res);
}

const filtros_lista = async (req, res) => {
    filtros(req.body, res);
}

const favorito_nuevo = async (req, res) => {
    favorito(req, res);
}

const solicitud_nuevo = async (req, res) => {
    solicitud(req.body, res);
}

const programa_detalle = async(req, res) => {
	programa(req.body, res);
}

module.exports = {
    oferta: oferta_lista,
    filtros: filtros_lista,
    favorito: favorito_nuevo,
    solicitud: solicitud_nuevo,
    programa: programa_detalle
}