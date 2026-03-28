const { registro } = require('./utils/registro');
const { login } = require('./utils/login');
const { forgot } = require('./utils/forgot');
const { reset } = require('./utils/reset');
const { activar } = require('./utils/activar');
const { verificar } = require('./utils/verificar');
const { perfilEditar } = require('./utils/perfilEditar');

const seguridad_registro = async (req, res) => {
	registro(req.body, res);
}

const seguridad_login = async (req, res) => {
	login(req.params, res);
}

const seguridad_forgot = async (req, res) => {
	forgot(req.params, res);
}

const seguridad_reset = async (req, res) => {
	reset(req.body, res);
}

const seguridad_activar = async (req, res) => {
	activar(req.body, res);
}

const seguridad_verificar = async (req, res) =>  {
	verificar(req.params, res);
}

const seguridad_perfil = async (req, res, next) => {
	perfil(req.body, res, next);
}

const seguridad_perfil_editar = async (req, res, next) => {
	perfilEditar(req.body, res, next);
}

module.exports = {
	registro: seguridad_registro,
	login: seguridad_login,
	forgot: seguridad_forgot,
	reset: seguridad_reset,
	activar: seguridad_activar,
	verificar: seguridad_verificar,
	perfil: seguridad_perfil,
	perfilEditar: seguridad_perfil_editar,
}