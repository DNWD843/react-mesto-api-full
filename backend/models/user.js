const mongoose = require('mongoose');

/**
 * @module
 * @description Схема пользователя - user<br>
 * @param {Object} name - поле name - имя пользователя
 * @param {String} name.type - тип данных - строка
 * @param {Number} name.minlength - минимальная длина имени
 * @param {Number} name.maxlength - максимальная длина имени
 * @param {Boolean} name.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @param {Object} about - поле about - информация о пользователе
 * @param {String} about.type - тип данных - строка
 * @param {Number} about.minlength - минимальная длина описания
 * @param {Number} about.maxlength - максимальная длина описания
 * @param {Boolean} about.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @param {Object} avatar - поле avatar -  ссылка на аватар пользователя
 * @param {String} avatar.type - тип данных - строка
 * @param {Object} avatar.validate - параметры валидации для проверки корректности
 *  введенных в поле данных
 * @param {Boolean} avatar.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @since v.1.1.0
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
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
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
