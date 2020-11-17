/**
 * @module
 * @description Корневой роутер. Обрабатывает пути из всех запросов
 * @since v.1.0.2
 */

const router = require('express').Router();
const usersRoutes = require('./users.js');
const cardsRoutes = require('./cards.js');
const badRequestRouter = require('./badRequest.js');

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);
router.use('*', badRequestRouter);

module.exports = router;
