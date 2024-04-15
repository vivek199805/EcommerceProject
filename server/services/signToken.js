const jwt = require('jsonwebtoken');
const config = require('../config');

const generateJWTToken = (userId) => {
  var accessToken = jwt.sign({user: userId}, config.secret, {expiresIn: '7d'});
  return accessToken;
};

module.exports = generateJWTToken