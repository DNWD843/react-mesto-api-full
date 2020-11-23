const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  //const token = req.cookies.token;

  const { authorization } = req.headers;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    const error = new UnauthorizedError('Необходима авторизация');
    return next(error);
  }
  const token = authorization.replace('Bearer ', '');
  if (!token) {
    const error = new UnauthorizedError('Необходима авторизация 2');
    return next(error);
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    const error = new UnauthorizedError('Необходима авторизация 3');
    next(error);
  }
  req.user = payload;
  next();
};

module.exports = { auth };
