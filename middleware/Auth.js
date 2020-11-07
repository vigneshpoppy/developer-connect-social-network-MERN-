const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token');
  //chek token is not valid
  if (!token) {
    return res.status(401).json({ msg: 'no token,acess denied' });
  }
  //check token is valid{
  try {
    const decoded = jwt.verify(token, config.get('jwttoken'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'token is not valid' });
  }
};
