/**
 * @module
 * @description Роутер. Обрабатывает некорректные пути запросов
 * @since v.1.0.0
 */

const router = require('express').Router();

router.use((req, res) => res.status(404).send({ message: 'Неверный запрос' }));

module.exports = router;
