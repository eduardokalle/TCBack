const { Rol } = require('../../../models/rol');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const roles = async (req, res) => {

    let role;

    try {
        role = await Rol.findAll({
            attributes: ['id', 'nombre'],
            order: [['nombre', 'ASC']],
        });
    }
    catch (error) {
        console.log("User");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send(role);
    
}

module.exports = {
    roles: roles
}