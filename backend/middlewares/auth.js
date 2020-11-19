const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация2' });
  }
  req.user = payload;

  next();
};

module.exports = { auth };
