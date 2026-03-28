const { listar } = require('./utils/listar');
const { borrar } = require('./utils/borrar');
const { detail } = require('./utils/detail');
const { editar } = require('./utils/editar');
const { roles } = require('./utils/roles');
const { editarRol } = require('./utils/editarRol');

const usuario_listar = async (req, res) => {
    listar(req, res);
}

const usuario_editar = async (req, res) => {	
	console.log(req.body);
    editar(req, res);
}

const usuario_borrar = async (req, res) => {
    borrar(req, res);
}

const usuario_detail = async (req, res) => {
    detail(req, res);
}

const lista_roles = async (req, res) => {
	roles(req, res);
}

const editar_rol = async (req, res) => {
	editarRol(req, res);
}


module.exports = {
    listar: usuario_listar,
	borrar: usuario_borrar,
	detail: usuario_detail,
	editar: usuario_editar,
	roles: lista_roles,
	editarRol: editar_rol
}