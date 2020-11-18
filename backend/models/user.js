const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/**
 * @description Схема пользователя - User<br>
 * @param {Object} name - имя пользователя
 * @param {Object} about - информация о пользователе
 * @param {Object} avatar - ссылка на аватар пользователя
 * @param {Object} email - емэйл пользователя (логин)
 * @param {Object} password - пароль
 * @method findUserByCredentials  - метод поиска пользователя по его логину и паролю.
 * Принимает аргументами емэйл (логин) и пароль, возвращает объект пользователя или ошибку
 * @since v.1.1.0
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        // eslint-disable-next-line
        const regex = /^https?:\/\/(www\.)?[\w\-\.]+\.[a-z]{2,3}\b[\w\/\-\?=\&\$\%]*(\.[a-z]{3})?#?$/;
        return regex.test(v);
      },
    },
    required: false,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(newError('Неправильные почта или пароль'));
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
