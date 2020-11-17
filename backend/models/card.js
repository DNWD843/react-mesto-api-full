const mongoose = require('mongoose');

/**
 * @module
 * @description Схема карточки - card<br>
 * @param {Object} name - поле name - название карточки
 * @param {String} name.type - тип данных - строка
 * @param {Number} name.minlength - минимальная длина названия
 * @param {Number} name.maxlength - максимальная длина названия
 * @param {Boolean} name.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @param {Object} link - поле link -  ссылка на изображение карточки
 * @param {String} link.type - тип данных - строка
 * @param {Object} link.validate - параметры валидации для проверки корректности
 *  введенных в поле данных
 * @param {Boolean} link.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @param {Object} owner - поле owner - информация о создателе карточки
 * @param {ObjectId} owner.type - тип данных - ObjectId ползователя, создавшего карточку
 * @param {String} owner.ref - ссылка на схему пользователя user
 * @param {Boolean}owner.required - определяет, является ли поле обязательным<br>
 *  - true - поле обязательное<br>
 *  - false - поле не обязательное
 * @param {Array} likes - поле likes - информация о лайках, массив ObjectId
 * @param {ObjectId} likes.type - тип данных элементов массива "лайков"
 * @param {Array} likes.default - значение по умолчанию - пустой массив
 * @param {Object} createdAt - поле createdAt - информация о дате создания карточки
 * @param {Date} createdAt.type - тип данных - дата
 * @param {Date} createdAt.default - значение по умолчанию - текущая дата и время,
 *  устанавливаются вызовом метода Date.now
 * @since v.1.1.0
 */
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
