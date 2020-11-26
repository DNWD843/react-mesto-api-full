import * as PATH_TO_ from './endpoints';

const BASE_URL = 'https://api.linuxoid.students.nomoreparties.xyz';

/**
 * @module auth
 * @description Компонент, содержащий методы отправки запросов на регистрацию, авторизацию,
 *  проверку токена.
 * @returns {Promise}
 * @since v.2.1.0
 */

/**
 * @method register
 * @description Отправляет запрос на регистрацию пользователя. Принимает аргументами данные
 *  пользователя, возвращает промис с данными, зарегистрированными на сервере.
 * @param {String} password - емэйл (логин), введенный пользователем при регистрации
 * @param {String} email -  пароль, введенный пользователем при регистрации
 * @returns {Promise}
 * @since v.2.1.0
 */
export const register = (password, email) => {
  return fetch(`${BASE_URL}${PATH_TO_.REGISTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    })
    .catch((err) => console.log(err));
};

/**
 * @method authorize
 * @description Отправляет запрос на авторизацию пользователя. Принимает аргументами данные
 *  пользователя, возвращает промис с токеном пользователя.
 * @param {String} password - емэйл (логин), введенный пользователем при авторизации
 * @param {String} email -  пароль, введенный пользователем при авторизации
 * @returns {Promise}
 * @since v.2.1.0
 */
export const authorize = (password, email) => {
  return fetch(`${BASE_URL}${PATH_TO_.LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    })
    .catch((err) => console.log(err));
};

/**
 * @method getContent
 * @description Отправляет запрос на проверку токена пользователя. Принимает аргументом токен,
 *  если токен действующий - возвращает промис с данными пользователя.
 * @param {String} token - токен пользователя, хранящийся в локальном хранилище браузера
 * @returns {Promise}
 * @since v.2.1.0
 */
export const getContent = (token) => {
  return fetch(`${BASE_URL}${PATH_TO_.USER}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    })
    .catch((err) => console.log(err));
};
