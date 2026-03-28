const { Usuario } = require('../../../models/usuario');
const { cifrar, descifrar, setRefreshToken } = require('./jwt');
const { bcrypt, baseURL, domain } = require('../../../../../config');
const { send } = require('../../../../email/send');

const registro = async ({
    nombre,
    apellido,
    password,
    email,
    birthdate,
    //alias,
    //celular
}, res) => {

	const hashed_contrasena = bcrypt.hashSync(password, 8);

	let currentdate = new Date(); 
	let datetime = currentdate.getFullYear() + "-"
		                + (currentdate.getMonth()+1)  + "-" 
		                + currentdate.getDate() + " "  
		                + currentdate.getHours() + ":"  
		                + currentdate.getMinutes() + ":" 
		                + currentdate.getSeconds();

	const reset_token = [...Array(80)].map(i=>(~~(Math.random()*36)).toString(36)).join('');

	const usuario = await Usuario.create({
		rol_id: "3",
		nombre: nombre,
		apellido: apellido,
		email: email,
		contrasena: hashed_contrasena,
		alias: '',
		estado: "0",
		fecha_nacimiento: birthdate,
		fecha_registro: datetime,
		celular: '',
		reset_token: reset_token
	});

	let link = domain+'login/activar/'+email+'/'+reset_token;
	const html = 'Para continuar con el proceso de registro, debes hacer click aquí para activar tu cuenta: <a href="'+link+'">'+link+'<a>';

	send(email, 'Activa tu cuenta', '', html);

	const token = cifrar({
		id: usuario.id
	});

	res.send({
		usuario: usuario,
		token: token
	});
}

module.exports = {
	registro: registro
}