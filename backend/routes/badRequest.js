const router = require('express').Router();

router.use((req, res) => res.status(404).send({ message: 'Неверный запрос' }));

module.exports = router;
