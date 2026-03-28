const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');
const { cargar } = require('./utils/cargar');

const programa_periodo_listar = async (req, res) => {
    listar(req, res);
}

const programa_periodo_crear = async (req, res) => {
    crear(req, res);
}

const programa_periodo_editar = async (req, res) => {
    editar(req, res);
}

const programa_periodo_borrar = async (req, res) => {
    borrar(req, res);
}

const programa_periodo_detalle = async (req, res) => {
    detalle(req, res);
}

const programa_periodo_cargar = async (req, res) => {
	cargar(req, res);
}

module.exports = { 
	listar: programa_periodo_listar,
	crear: programa_periodo_crear,
	editar: programa_periodo_editar,
	borrar: programa_periodo_borrar,
	detalle: programa_periodo_detalle,
	cargar: programa_periodo_cargar
}
