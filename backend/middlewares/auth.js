const jwt = require('jsonwebtoken');

const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  /* const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }

  const token = authorization.replace('Bearer ', '');   */
  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация2' });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация3' });
  }
  req.user = payload;
  next();
};

module.exports = { auth };
