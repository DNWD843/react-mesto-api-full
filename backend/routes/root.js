/**
 * @module
 * @description Корневой роутер. Обрабатывает пути из всех запросов
 * @since v.1.0.2
 */

const router = require('express').Router();
const usersRoutes = require('./users.js');
const cardsRoutes = require('./cards.js');
const badRequestRouter = require('./badRequest.js');
const { login, createUser } = require('../controllers/users.js');
const { auth } = require('../middlewares/auth.js');
const { createUserReqValidator, loginReqValidator } = require('../middlewares/usersValidators');

router.post('/signin', loginReqValidator, login);
router.post('/signup', createUserReqValidator, createUser);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('*', badRequestRouter);

module.exports = router;
