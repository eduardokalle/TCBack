const { jwt, randtoken, secreto, refreshTokens } = require('../../../../../config');

const cifrar = (payload) => {
    return jwt.sign(payload, secreto, {
      expiresIn: 86400
    });
}

const descifrar = (token) => {

    const payload = jwt.verify(token, secreto, function(err, decoded) {
		if (err) {
			return false;
		}

		return decoded;
	});
	return payload;
}

const setRefreshToken = (username) => {
	const refreshToken = randtoken.uid(256);
	refreshTokens[refreshToken] = username;

	return refreshToken;
}

const getRefreshTokens = () => {
	return refreshTokens;
}

module.exports = {
	cifrar: cifrar,
	descifrar: descifrar,
	setRefreshToken: setRefreshToken,
	getRefreshTokens: getRefreshTokens,
}