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
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards.js');

const {
  getCardsReqValidator,
  createCardReqValidator,
  deleteCardReqValidator,
  likeCardReqValidator,
  dislikeCardReqValidator,
} = require('../middlewares/cardsValidators');

router.get('/', getCardsReqValidator, getCards);
router.post('/', createCardReqValidator, createCard);
router.delete('/:cardId', deleteCardReqValidator, deleteCard);
router.put('/likes/:cardId', likeCardReqValidator, likeCard);
router.delete('/likes/:cardId', dislikeCardReqValidator, dislikeCard);

module.exports = router;
