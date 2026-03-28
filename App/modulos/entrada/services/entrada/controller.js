const { entradas } = require('./utils/entradas');
const { destacadas } = require('./utils/destacadas');
const { detalle } = require('./utils/detalle');
const { banners } = require('./utils/banner');

const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detail } = require('./utils/detail');

const { entradaTiposListar } = require('./utils/entradaTiposListar');


const entradas_lista = async (req, res) => {
    entradas(req.body, res);
}

const destacadas_lista = async (req, res) => {
    destacadas(req.body, res);
}

const detalle_data = async (req, res) => {
    detalle(req.params, res);
}

const banner_lista = async (req, res) => {
    banners(req.params, res);
}

const entrada_listar = async (req, res) => {
    listar(req, res);
}

const entrada_crear = async (req, res) => {
    crear(req, res);
}

const entrada_editar = async (req, res) => {
    editar(req, res);
}

const entrada_borrar = async (req, res) => {
    borrar(req, res);
}

const entrada_detail = async (req, res) => {
    detail(req, res);
}

const entrada_tipo_listar = async (req, res) => {
    entradaTiposListar(req, res);
}

module.exports = {
    entradas: entradas_lista,
    destacadas: destacadas_lista,
    detalle: detalle_data,
    banners: banner_lista,

    listar: entrada_listar,
	crear: entrada_crear,
	editar: entrada_editar,
	borrar: entrada_borrar,
	detail: entrada_detail,

    listarTipos: entrada_tipo_listar,
}