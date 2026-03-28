const { FavoritoUsuario } = require('../../../../seguridad/models/favoritoUsuario');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const favorito = async (req, res) => {

	let programaId = req.body.programaId;
	let user_id = req.body.user_id;

	const schema = {
		programaId: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required()
	};

	const { error, value } = joi.validate({ 
											programaId
										}, schema);

	if(!error) {

		let data = {};

		let existe;
		try {
			existe = await FavoritoUsuario.findOne({
				attributes: ['id'],
                where: [{
					programa_id: programaId,
					usuario_id: user_id,
				}]
			});
		}
		catch(error) {
			return res.status(400).send(error);
		}

		if(existe) {
			let programaFavorito;
    		try {
				programaFavorito = await FavoritoUsuario.destroy({
		            where: {
		                programa_id: programaId,
						usuario_id: user_id,
		            }
		        })
		    }
		    catch (error) {
		        console.log("Prg. Fav.");
		        console.log(error);
		        return res.status(400).send('error');
		    }

			data.mensaje = "Programa eliminado de favoritos."
		}
		else {
			let currentdate = new Date(); 
			let datetime = currentdate.getFullYear() + "-"
			                + (currentdate.getMonth()+1)  + "-" 
			                + currentdate.getDate() + " "  
			                + currentdate.getHours() + ":"  
			                + currentdate.getMinutes() + ":" 
			                + currentdate.getSeconds();

			try {
				favoritoUsuario = await FavoritoUsuario.create({
					programa_id: programaId,
					usuario_id: user_id,
					fecha: datetime
				});
			}
			catch (error) {
				return res.status(400).send(error);
			}
			data.favoritoUsuario = favoritoUsuario;
			data.mensaje = "Programa agregado a favoritos."
		}


		return res.send({
			data: data
		});
	}
	else {
		res.status(500).send('Error de validación');
	}
}

module.exports = {
	favorito: favorito
}