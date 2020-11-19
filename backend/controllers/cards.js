const Card = require('../models/card');

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
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() =>
      res.status(500).send({ message: 'Внутренняя ошибка сервера' })
    );
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
const createCard = (req, res) => {
  const { name, link } = req.body;
  // req.user._id - временное решение авторизции.
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
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
/*
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ message: 'Карточка успешно удалена', deletedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
}; */

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: 'Невозможно удалить чужую карточку' });
      }
      card.remove();
      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
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
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // req.user._id - временное решение авторизции.
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточки с таким id нет' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
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
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // req.user._id - временное решение авторизции.
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточки с таким id нет' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
