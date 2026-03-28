const { descifrar } = require('./jwt');

const reconocer = (req, res, next) => {

	if(req.headers.authorization) {
		const token = req.headers.authorization.replace('Bearer ', '');

		if (!token) {
		    next();
		}
		else {
			const decoded = descifrar(token);
		
			if(!decoded) {
				res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
			}
			else {
				req.body.user_id = decoded.id
				console.log(req.body.user_id);
				next();
			}
		}
	}
	else {
		next();
	}
}

module.exports = {
	reconocer: reconocer
}