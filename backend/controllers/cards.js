const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

/**
 * @module
 * @description Контроллеры модели card.<br>
 * Обрабатывают запросы:<br>
 *  - GET /cards - возвращает все карточки<br>
 *  - POST /cards - создаёт новую карточку<br>
 *  - DELETE /cards/:cardId - удаляет карточку по идентификатору<br>
 *  - PUT /cards/:cardId/likes — ставит лайк карточке<br>
 *  - DELETE /cards/:cardId/likes — удаляет лайк с карточки
 * @since v.1.0.0
 */

/**
 * @description Контроллер<br>
 * Получает данные всех карточек и отправляет их пользователю.<br>
 * Обрабатываeт запрос GET /cards
 * @param {object} req - объект запроса
 * @param {object} res - объект ответа
 * @property {Method} Card.find - метод модели Card, ищет все карточки и возвращает их
 *  пользователю
 * @returns {JSON}
 * @since v.1.0.0
 * @instance
 * @public
 */
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
      return res.status(200).send(cards);
    })
    .catch(next);
};

/**
 * @description Контроллер<br>
 * Создаёт новую карточку и возвращает её пользователю.<br>
 * Обрабатываeт запрос POST /cards
 * @param {object} req - объект запроса
 * @param {object} res - объект ответа
 * @property {String} req.body.name - название карточки из запроса
 * @property {String} req.body.link - ссылка на изображение карточки из запроса
 * @property {Method} Card.create - метод модели Card, создает карточку. Принимает аргументом объект
 *  с данными для создания новой карточки
 * @property {Object} newCardData - объект с данными для создания новой карточки
 * @property {String} newCardData.name - название карточки
 * @property {String} newCardData.link - ссылка на изображение карточки
 * @property {String} newCardData.owner - идентификатор пользователя, создавшего карточку
 * @returns {JSON}
 * @instance
 * @since v.1.1.0
 * @public
 */
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: { _id: req.user._id } })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Переданы некорректные данные');
        return next(error);
      }
      return next(err);
    });
};

/**
 * @description Контроллер<br>
 * Удаляет карточку по её идентификатору, возвращает сообщение об успешном удалении
 *  и удаленную карточку.<br> Обрабатываeт запрос DELETE /cards/:cardId
 * @param {object} req - объект запроса
 * @param {object} res - объект ответа
 * @property {Method} Card.findByIdAndRemove - метод модели Card. Находит карточку по её
 *  идентификатору и удаляет.  Принимает аргументом _id удаляемой карточки из параметров запроса
 * @property {String} req.params.cardId - _id удаляемой карточки, передается в параметрах запроса
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      }
      card.remove();
      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.log(err);
      if (err.name === 'CastError') {
        const error = new BadRequestError('Невалидный id');
        return next(error);
      }
      return next(err);
    });
};

/**
 * @description Контроллер<br>
 * Добавляет "лайк" карточке, возвращает карточку с обновленным  массивом "лайков".<br>
 * Обрабатываeт запрос PUT /cards/:cardId/likes
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} Card.findByIdAndUpdate - метод модели Card. Находит карточку по её
 *  идентификатору и обновляет её свойства.  Принимает аргументами:<br>
 *  - _id обновляемой карточки из параметров запроса<br>
 *  - объект со свойствами, которые нужно обновить<br>
 *  - объект опций
 * @property {String} req.params.cardId - _id обновляемой карточки, передается в параметрах запроса
 * @property {Object} properties - объект со свойствами, которые нужно обновить
 * @property {Method} properties.$addToSet - оператор БД MongoDB, добавляет элемент в массив, если
 *  его там еще нет
 * @property {Array}  properties.$addToSet.likes - массив "лайков" карточки
 * @property {String} properties.$addToSet.likes.req.user._id - идентификатор пользователя,
 *  "лайкнувшего" карточку
 * @property {Object} options - объект опций метода Card.findByIdAndUpdate
 * @property {Parameters} options.new - если true, метод возвращает обновленные данные.
 *  По умолчанию false.
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточкa не найдена');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

/**
 *
 * @description Контроллер<br>
 * Удаляет "лайк" у карточки, возвращает карточку с обновленным массивом "лайков".<br>
 * Обрабатываeт запрос DELETE /cards/:cardId/likes
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} Card.findByIdAndUpdate - метод модели Card. Находит карточку по её
 *  идентификатору и обновляет её свойства.  Принимает аргументами:<br>
 *  - _id обновляемой карточки из параметров запроса<br>
 *  - объект со свойствами, которые нужно обновить<br>
 *  - объект опций
 * @property {String} req.params.cardId - _id обновляемой карточки, передается в параметрах запроса
 * @property {Object} properties - объект со свойствами, которые нужно обновить
 * @property {Method} properties.$pull - оператор БД MongoDB, удаляет элемент из массива
 * @property {Array}  properties.$pull.likes - массив "лайков" карточки
 * @property {String} properties.$pull.likes.req.user._id - идентификатор пользователя,
 *  "лайкнувшего" карточку
 * @property {Object} options - объект опций метода Card.findByIdAndUpdate
 * @property {Parameters} options.new - если true, метод возвращает обновленные данные.
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
