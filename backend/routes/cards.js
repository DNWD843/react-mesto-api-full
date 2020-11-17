/**
 * @module
 * @description Роутер cards. Обрабатывает запросы:<br>
 *  - GET /cards - возвращает все карточки<br>
 *  - POST /cards - создаёт новую карточку<br>
 *  - DELETE /cards/:cardId - удаляет карточку по идентификатору<br>
 *  - PUT /cards/:cardId/likes — ставит лайк карточке<br>
 *  - DELETE /cards/:cardId/likes — удаляет лайк с карточки
 * @since v.1.0.0
 */

const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards.js');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
