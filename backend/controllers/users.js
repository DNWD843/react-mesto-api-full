const User = require('../models/user');

/**
 * @module
 * @description Контроллеры модели user.<br>
 * Обрабатывают запросы:<br>
 *  - GET /users - возвращает данных всех пользователей<br>
 *  - GET /users/id - возвращает данные конкретного пользователя по его _id<br>
 *  - POST /users - добавляет нового пользователя<br>
 *  - PATCH /users/me — обновляет профиль<br>
 *  - PATCH /users/me/avatar — обновляет аватар
 * @since v.1.0.0
 */

/**
 * @description Контроллер<br>
 * Получает данные всех пользователей, в ответ отправляет все полученные данные
 *  запрашивающему пользователю<br>
 * Обрабатываeт запрос GET /users
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} Card.find - метод модели Card, ищет все карточки и возвращает их
 *  пользователю
 * @returns {JSON}
 * @since v.1.0.0
 * @instance
 * @public
 */
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

/**
 * @description Контроллер<br>
 * Получает данные конкретного пользователя по его идентификатору, в ответ отправляет
 *  полученные данные запрашивающему пользователю.<br>
 * Обрабатываeт запрос GET /users/id<br>
 * Принимает идентификатор _id в параметрах запроса.
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} User.findById - метод модели User. Находит и возвращает данные пользователя
 *  по его идентификатору. Принимает аргументов идентификатор пользователя.
 * @property {String} req.params.userId - _id искомого пользователя, принимается из параметров
 *  запроса
 * @returns {JSON}
 * @since v.1.0.0
 * @instance
 * @public
 */
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

/**
 * @description Контроллер<br>
 * Создает нового пользователя, в ответ отправляет данные созданного пользователя<br>
 * Принимает параметры из тела запроса: { name, about, avatar }<br>
 * Обрабатываeт запрос POST /users
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {String} req.body.name - имя нового пользователя из тела запроса
 * @property {String} req.body.about - информация о новом пользователе из тела запроса
 * @property {String} req.body.avatar - ссылка на аватар нового пользователя из тела запроса
 * @property {Method} User.create - метод модели User, создает нового пользователя. Возвращает
 *  данные нового пользователя. Принимает аргументом объект с данными для создания нового
 *  пользователя.
 * @property {Object} newUserData - объект с данными для создания нового пользователя
 * @property {String} newUserData.name - имя нового пользователя
 * @property {String} newUserData.about - информация о новом пользователе
 * @property {String} newUserData.avatar - ссылка на аватар нового пользователя
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

/**
 * @description Контроллер<br>
 * Обновляет данные пользователя, возвращает обновленные данные.<br>
 * Обрабатываeт запрос PATCH /users/me
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} Card.findByIdAndUpdate - метод модели User. Находит данные пользователя по его
 *  идентификатору и обновляет их. Возвращает обновленные данные. Принимает аргументами:<br>
 *  - _id пользователя из параметров запроса<br>
 *  - объект со свойствами, которые нужно обновить<br>
 *  - объект опций
 * @property {String} req.user._id - _id пользователя, <b>временно захардкорен в параметрах
 *  запроса<b>
 * @property {Object} properties - объект со свойствами, которые нужно обновить
 * @property {String} properties.name - имя пользователя
 * @property {String} properties.about - информация о пользователе
 * @property {Object} options - объект опций метода Card.findByIdAndUpdate
 * @property {Parameters} options.new - если true, метод возвращает обновленные данные.
 *  По умолчанию false.
 * @property {Parameters} options.runValidators - если true, данные будут валидированы перед
 *  изменением. По умолчанию false.
 * @property {Parameters} options.upsert - если пользователь не найден, он будет создан.
 *  По умолчанию false.
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const editUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    // req.user._id - временное решение авторизции.
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

/**
 * @description Контроллер<br>
 * Обновляет данные пользователя, возвращает обновленные данные.<br>
 * Обрабатываeт запрос PATCH /users/me/avatar
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 * @property {Method} Card.findByIdAndUpdate - метод модели User. Находит данные пользователя по его
 *  идентификатору и обновляет их. Возвращает обновленные данные. Принимает аргументами:<br>
 *  - _id пользователя из параметров запроса<br>
 *  - объект со свойствами, которые нужно обновить<br>
 *  - объект опций
 * @property {String} req.user._id - _id пользователя, <b>временно захардкорен в параметрах
 *  запроса<b>
 * @property {Object} properties - объект со свойствами, которые нужно обновить
 * @property {String} properties.avatar - ссылка на аватар пользователя
 * @property {Object} options - объект опций метода Card.findByIdAndUpdate
 * @property {Parameters} options.new - если true, метод возвращает обновленные данные.
 *  По умолчанию false.
 * @property {Parameters} options.runValidators - если true, данные будут валидированы перед
 *  изменением. По умолчанию false.
 * @property {Parameters} options.upsert - если пользователь не найден, он будет создан.
 *  По умолчанию false.
 * @returns {JSON}
 * @since v.1.1.0
 * @instance
 * @public
 */
const editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    // req.user._id - временное решение авторизции.
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUserProfile,
  editUserAvatar,
};
