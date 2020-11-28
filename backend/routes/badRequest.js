const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');

router.use(() => {
  throw new NotFoundError('Неверный запрос');
});

module.exports = router;
