const { enviar } = require('./utils/contacto');

const contacto_enviar = async (req, res) => {
    enviar(req.body, res);
}

module.exports = {
    enviar: contacto_enviar
}