export const TOKEN_KEY = "token";

/**
 * @module token
 * @description Компонент, содержащий методы работы с токеном.
 * @since v.2.1.0
 */

/**
 * @method setToken
 * @description Метод сохранения токена в локальное хранилище браузера
 * @param {String} token - токен
 * @since v.2.1.0
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * @method getToken
 * @description Метод получения токена из локального хранилища браузера
 * @since v.2.1.0
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * @method removeToken
 * @description Метод удаления токена из локального хранилища браузера
 * @since v.2.1.0
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
