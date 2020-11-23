const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  const token = req.cookies.token;

  if (!token) {
    const error = new UnauthorizedError('Необходима авторизация 2');
    next(error);
    return;
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
