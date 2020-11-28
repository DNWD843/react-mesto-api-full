const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { SALT_ROUND, JWT_MAX_AGE } = require('../configs');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV = 'develop', JWT_SECRET } = process.env;

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
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      return res.status(200).send(users);
    })
    .catch(next);
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
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Переданы некорректные данные');
        return next(error);
      }
      return next(err);
    });
};

/**
 * @description Контроллер<br>
 * Создает нового пользователя, в ответ отправляет данные созданного пользователя<br>
 * Принимает параметры из тела запроса: { name, about, avatar }<br>
 * Обрабатываeт запрос POST /signup
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
 * @property {String} newUserDta.email - емэйл пользователя (логин)
 * @property {String} newUserData.password - пароль
 * @returns {JSON}
 * @since v.1.3.0
 * @instance
 * @public
 */
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(200).send({ _id: user._id, email: user.email }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const error = new BadRequestError('Переданы некорректные данные');
          return next(error);
        }
        if (err.name === 'MongoError') {
          const error = new ConflictError('Пользователь с такими данными уже зарегистрирован');
          return next(error);
        }
        return next(err);
      }));
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
const editUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
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
const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
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
 * Проверяет учетные данные пользователя. Если пользователь найден в базе - отправляет его токен.
 *  Принимает емэйл (логин) и пароль, возвращает токен.<br>
 * Обрабатывает запрос POST/signin
 * @param {Object} req - объект запроса
 * @property {String} req.email - емэйл (логин)
 * @property {String} req.password - пароль
 * @param {Object} res - объект ответа
 * @property {String} res.token - токен
 * @returns {Object} token
 * @since v.1.3.0
 */

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
      const token = jwt.sign({ _id: user._id }, secret, {
        expiresIn: JWT_MAX_AGE,
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      const error = new UnauthorizedError(err.message);
      return next(error);
    });
};

/**
 * @description Контроллер<br>
 * Получает и возвращает данные авторизованного пользователя.<br>
 * Обрабатывает запрос GET /users/me
 * @param {Object} req - объект запроса
 * @property {String} req.user._id - id авторизованного пользователя
 * @param {Object} res - объект ответа
 * @returns {Object}
 * @since v.1.3.0
 */
const getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Переданы некорректные данные');
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  editUserProfile,
  editUserAvatar,
  login,
  getAuthorizedUser,
};
