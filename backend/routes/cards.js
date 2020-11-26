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
