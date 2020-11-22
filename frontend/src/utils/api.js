import { TOKEN_KEY } from '../utils/token';

/**
 * @description  Класс Api <br>
 * Отвечает за отправку запросов на сервер и проверку полученных ответов
 * @param {Object} Object - принимает в конструктор объект { URLs, headers, token }
 * @param {Object} Object.URLs  - объект, содержащий адреса для отправки запросов
 * @param {String} Object.URLs.baseURL - базовый URL сервера
 * @param {String} Object.URLs.cardsURL - URL для получения/добавления карточек
 * @param {String} Object.URLs.userURL - URLдля получения/добавления данных пользователя
 * @param {String} Object.URLs.likesURL - URL для получения/добавления информации о "лайках"
 * @param {String} Object.URLs.avatarURL - URL для получения/добавления ссылки на аватар
 * @param {Object} Object.headers - объект, содержащий заголовки запросов
 * @param {String} Object.headers.authorization - код авторизации (токен)
 * @param {String} Object.token  - токен для доступа на сервер
 * @since v.1.0.0
 * @example
 * const api = new Api({
 * URLs: {
 *   baseURL: 'https://mesto...',
 *   cardsURL: 'https://mesto.../cards/',
 *   userURL: 'https://mesto.../users/me',
 *   likesURL: 'https://mesto.../cards/likes/',
 *   avatarURL: 'https://mesto.../users/me/avatar'
 * },
 * headers: {
 *   "authorization": '<Ваш код авторизации>'
 * },
 * token: '<Ваш токен>'
 * });
 */
class Api {
  constructor({ URLs, headers, token }) {
    this._baseURL = URLs.baseURL;
    this._cardsURL = URLs.cardsURL;
    this._userURL = URLs.userURL;
    this._likesURL = URLs.likesURL;
    this._avatarURL = URLs.avatarURL;
    this._headers = headers;
    this._token = token;
  }

  /**
   * @description  Публичный метод<br>
   * Загружает с сервера данные пользователя
   * @public
   * @returns {Promise} - возвращает промис с данными пользователя
   * @since v.1.0.0
   */
  loadUserData() {
    console.log(`Bearer ${localStorage.getItem(TOKEN_KEY)}`);

    return fetch(this._userURL, {
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description  Публичный метод<br>
   * Загружает элементы с сервера
   * @public
   * @returns {Promise} - возвращает промис с данными элементов, сохраненных на сервере
   * @since v.1.0.0
   */
  loadCards() {
    console.log(`Bearer ${localStorage.getItem(TOKEN_KEY)}`);
    return fetch(this._cardsURL, {
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description Публичный метод<br>
   * Сохраняет на сервер элемент, добавленный через Форму добавления нового элемента<br>
   * Принимает аргументом объект item
   * @public
   * @param {Object} item  - объект с параметрами элемента
   * @param {String} item.name - название элемента из инпута Формы добавления нового элемента
   * @param {String} item.link - ссылка на изображение элемента из инпута Формы добавления нового элемента
   * @returns {Promise} - возвращает промис, содержащий данные нового элемента, полученные от сервера
   * @since v.1.0.0
   * @example
   * api.addNewCard({name: <название элемента>, link: <ссылка на изображение элемента>})
   */
  addNewCard(item) {
    return fetch(this._cardsURL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: item.name,
        link: item.link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description Публичный метод<br>
   * Удаляет элемент с сервера<br>
   * Принимает аргументом id удаляемого элемента
   * @public
   * @param {String} cardId  - id удаляемого элемента
   * @returns {Promise} - возвращает промис с сообщением об успешном удалении элемента
   * @since v.1.0.0
   */
  deleteCard(cardId) {
    return fetch(`${this._cardsURL}/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description Публичный метод<br>
   * Редактирует данные в профиле пользователя на сервере<br>
   * Принимает арументом объект с новыми данными пользователя, веденными через Форму редактирования профиля
   * @public
   * @param {Object} Object  - { name, about } - объект с новыми данными пользователя
   * @param {String} Object.name - новое имя пользователя, введенное в Форму редактирования профиля
   * @param {String} Object.about - новое описание пользователя, введенное в Форму редактирования профиля
   * @returns {Promise} - возвращает промис, содержащий новые данные пользователя, сохраненные на сервере
   * @since v.1.0.0
   * @example
   * api.editProfile({
   *   name: <новое имя пользователя, введенное в инпут Формы редактирования профиля>,
   *   job: <новое описание пользователя, введенное в инпут Формы редактирования профиля >
   * });
   */
  editProfile({ name, about }) {
    return fetch(`${this._userURL}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description Публичный метод<br>
   * Изменяет статус кнопки "лайк" у карточки<br>
   * Принимает аргументом id карточки, у которой произошло нажатие "лайка" и новое состояние "лайка"
   * @public
   * @param {String} id - id элемента, на котором произошло нажатие "лайка"
   * @param {Boolean} likeStatus - новое состояние "лайка": если true - "лайк" поставлен, если false - "лайк" снят
   * @returns {Promise} - возвращает промис, содержащий новые данные пользователя, сохраненные на сервере
   * @public
   * @since v2.0.2
   */
  changeLikeCardStatus(id, likeStatus) {
    return fetch(`${this._likesURL}${id}`, {
      method: `${likeStatus ? 'PUT' : 'DELETE'}`,
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }

  /**
   * @description Публичный метод<br>
   * Сохраняет на сервер новую ссылку на аватар пользователя<br>
   * Принимает аргументом ссылку на новый аватар пользователя, полученную из Формы редактирования аватара
   * @public
   * @param {String} avatar - новая ссылка на аватар пользователя, полученная из Формы редактирования аватара
   * @returns {Promise} - возвращает промис, содержащий новые данные пользователя, сохраненные на сервере
   * @since v.1.0.0
   */
  editAvatar(avatar) {
    return fetch(`${this._avatarURL}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}: ${res.statusText}`);
    });
  }
}

/**
 * @constant api
 * @description Экземпляр класса Api<br>
 * Экспортируется в компонент App
 * @memberof Api
 * @instance
 * @since v.2.0.0
 */
const api = new Api({
  URLs: {
    baseURL: 'http://localhost:3000',
    cardsURL: 'http://localhost:3000/cards',
    userURL: 'http://localhost:3000/users/me',
    likesURL: 'http://localhost:3000/cards/likes/',
    avatarURL: 'http://localhost:3000/users/me/avatar',
  },
  headers: {
    authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  },
});

export default api;
