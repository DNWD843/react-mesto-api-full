import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import InfoToolTip from './InfoToolTip';
import Login from './Login';
import Register from './Register';
import * as TO_ from '../utils/routesMap';
import ProtectedRoute from './ProtectedRoute';
import { getToken, removeToken, setToken } from '../utils/token';
import * as auth from '../utils/auth';
import NavBar from './NavBar';

/**
 * @description Классовый React-компонент<br>
 * Главный компонент приложения<br>
 * Собирает все компоненты приложения и декларирует их отрисовку<br>
 * @returns {JSX} - JSX-разметка приложения
 * @since v.2.0.0
 */
class App extends React.Component {
  constructor() {
    super();

    /**
     * @description Объявление стейтов и установка их начальных значений
     * @param {Object} state - объект со стейтами
     * @property {Boolean} state.isEditProfilePopupOpen - стейт попапа редактирования профиля,
     *  управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property {Boolean} state.isAddPlacePopupOpen - стейт попапа добавления карточки,
     * управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property {Boolean} state.isEditAvatarPopupOpen - стейт попапа редактирования аватара,
     * управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property{Boolean} state.isDeleteConfirmPopupOpen - стейт попапа подтверждения удаления
     *  карточки, управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property {Boolean} state.isImagePopupOpen - стейт попапа с полноразмерным изображением,
     * управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property {Object | undefined} state.selectedCard - стейт кликнутой карточки,
     * Начальное значение пустой объект - карточка не определена
     * @property {Object} state.currentUser - стейт, сохраняет объект с данными о текущем пользователе
     * @property {Array} state.cards - стейт, содержит массив объектов с данными карточек
     * @property {Boolean} state.isLoading - стейт состояния процесса, true - процесс выполняется,
     *  false- процесс не выполняется
     * @property {Boolean} state.loggedIn - стейт статуса пользователя: залогинен (true)
     *  или нет (false)
     * @property {Object} state.userData - стейт, объект с данными пользователя
     * @property {String} state.userData.email - емэйл пользователя (логин профиля)
     * @property {String} state.userData.password - пароль, указанный пользователем при входе
     * @property{String} state.userData.password - пароль профиля пользователя
     * @property {Boolean} state.isInfoToolTipOpen - стейт попапа подсказки о результате авторизации,
     *  управляет видимостью попапа. Начальное значение false - попап скрыт
     * @property {Boolean} state.isMenuOpened - стейт состояния меню на мобильном разрешении,
     *  управляет изображением кнопки открытия/закрытия меню.
     * @this App
     */
    this.state = {
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isImagePopupOpen: false,
      selectedCard: {},
      currentUser: {},
      cards: [],
      isLoading: false,
      loggedIn: false,
      userData: {
        email: '',
        password: '',
      },
      isInfoToolTipOpen: false,
      isMenuOpened: false,
    };
  }

  /**
   * @method  closeAllPopups
   * @description Публичный метод<br>
   * Стрелочная функция, закрывает все попапы, удаляет слушатель нажатия клавиши Esc
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   */
  closeAllPopups = () => {
    document.removeEventListener('keydown', this.handleEscClose);
    this.setState({
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isDeleteConfirmPopupOpen: false,
      isImagePopupOpen: false,
      selectedCard: {},
      isInfoToolTipOpen: false,
    });
  };

  /**
   * @method handleEscClose
   * @description Обработчик нажатия на клавишу Escape<br>
   * Стрелочная функция, закрывает попап при нажатии клавиши Esc
   * @param {Event} evt - событие
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   */
  handleEscClose = (evt) => {
    if (evt.key === 'Escape') {
      this.closeAllPopups();
    }
  };

  /**
   * @method handleClickOnOverlay
   * @description Обработчик клика по оверлею<br>
   * Стрелочная функция, закрывает попап при клике по оверлею
   * @param {Event} evt - событие
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   */
  handleClickOnOverlay = (evt) => {
    /**
     * Проверка истинности условия - клик по оверлею <br>
     * Примечание: этот метод используется как обработчик в слушателе клика на оверлее попапа<br>
     * Поэтому в данном случае условие проверяет совпадение клика именно на оверлее попапа
     * @ignore
     */
    if (evt.target === evt.currentTarget) {
      this.closeAllPopups();
    }
  };

  /**
   * @method handleCardLike
   * @description Обработчик клика по иконке "лайк"<br>
   * Стрелочная функция, принимает аргументом объект с данными карточки.
   * Ставит или снимает "лайки", в зависимости от состояния "лайка".
   * @param {Object} card - объект с данными лайкнутой карточки
   * @param {String} card.id - id лайкнутой карточки
   * @param {Array} card.likes - массив "лайков" лайкнутой карточки
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.2
   * @see {@link Card}
   */
  handleCardLike = (card) => {
    const isLiked = card.likes.some((likeOwner) => likeOwner._id === this.state.currentUser._id);
    api
      .changeLikeCardStatus(card.id, !isLiked)
      .then((newCard) => {
        const newCards = this.state.cards.map((cardsItem) =>
          cardsItem.id === card.id
            ? {
                id: newCard._id,
                link: newCard.link,
                title: newCard.name,
                likesQuantity: newCard.likes.length,
                owner: newCard.owner,
                likes: newCard.likes,
              }
            : cardsItem,
        );
        this.setState({ cards: newCards });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * @function handleCardClick
   * @description Обработчик клика по изображению карточки<br>
   * Стрелочная функция, открывает попап с полноразмерным изображением карточки,
   * добавляет слушатель нажатия клавиши Esc
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   * @see {@link Card}
   */
  handleCardClick = (card) => {
    document.addEventListener('keydown', this.handleEscClose);
    this.setState({ selectedCard: card });
    this.setState({ isImagePopupOpen: true });
  };

  /**
   * @method handleCardDelete
   * @description Обработчик клика по иконке "удалить"<br>
   * Стрелочная функция, принимает аргументом объект с данными карточки и сохраняет его в стейт.
   * Открывает попап подтверждения удаления карточки
   * @param {Object} card - объект с данными удаляемой карточки
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.4
   * @see {@link Card}
   */
  handleCardDelete = (card) => {
    this.setState({ isDeleteConfirmPopupOpen: true });
    this.setState({ selectedCard: card });
  };

  /**
   * @function handleDeleteConfirm
   * @description Обработчик подтверждения удаления карточки (сабмит попапа подтверждения удаления)<br>
   * Стрелочная функция, удаляет карточку.
   * @param {Event} evt - событие, принимается для отмены стандартного поведения формы при сабмите
   * @memberof App
   * @instance
   * @public
   * @since v.2.0.4
   * @see {@link Card}
   * @see {@link DeleteConfirmPopup}
   */
  handleDeleteConfirm = (evt) => {
    evt.preventDefault();
    const card = this.state.selectedCard;
    this.setState({ isLoading: true });

    api
      .deleteCard(card.id)
      .then(() => {
        const newCards = this.state.cards.filter((cardsItem) => {
          return cardsItem.id !== card.id;
        });
        this.setState({ cards: newCards });
        this.closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  /**
   * @method handleEditAvatarClick
   * @description Обработчик клика по аватару<br>
   * Стрелочная функция, открывает попап редактирования аватара, добавляет слушатель нажатия клавиши Esc
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   * @see {@link Main}
   */
  handleEditAvatarClick = () => {
    document.activeElement.blur();
    document.addEventListener('keydown', this.handleEscClose);
    this.setState({ isEditAvatarPopupOpen: true });
  };

  /**
   * @function handleUpdateAvatar
   * @description Обработчик сабмита формы редактирования аватара<br>
   * Изменяет аватар пользователя.<br>
   * Стрелочная функция, принимает объект с новой ссылкой на аватар пользователя,
   * возвращает объект с изменнуми данными пользователя
   * @param {Object} Object - объект с новой ссылкой на аватар пользователя
   * @param {String} Object.avatar - новая ссылка на аватар пользователя
   * @memberof App
   * @instance
   * @public
   * @since v.2.0.2
   * @see {@link EditAvatarPopup}
   */
  handleUpdateAvatar = ({ avatar }) => {
    this.setState({ isLoading: true });
    api
      .editAvatar(avatar)
      .then((res) => {
        this.setState({ currentUser: res });
        this.closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  /**
   * @method handleEditProfileClick
   * @description Обработчик клика по кнопке "Редактировать профиль"<br>
   * Стрелочная функция, открывает попап редактирования профиля, добавляет слушатель нажатия клавиши Esc
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   * @see {@link Main}
   */
  handleEditProfileClick = () => {
    document.activeElement.blur();
    document.addEventListener('keydown', this.handleEscClose);
    this.setState({ isEditProfilePopupOpen: true });
  };

  /**
   * @function handleUpdateUser
   * @description Обработчик сабмита формы редактирования профиля<br>
   * Редактирует профиль пользователя.<br>
   * Стрелочная функция, принимает объект с новыми данными профиля пользователя,
   * возвращает объект с измененными данными профиля пользователя
   * @param {Object} Object - объект с новыми данными профиля пользователя
   * @param {String} Object.name - новое имя пользователя
   * @param {String} Object.about - новое описание пользователя
   * @memberof App
   * @instance
   * @public
   * @since v.2.0.2
   * @see {@link EditProfilePopup}
   */
  handleUpdateUser = ({ name, about }) => {
    this.setState({ isLoading: true });

    api
      .editProfile({ name, about })
      .then((res) => {
        this.setState({ currentUser: res });
        this.closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  /**
   * @method handleAddPlaceClick
   * @description Обработчик клика по кнопке "Добавить фото"<br>
   * Стрелочная функция, открывает попап добавления новой карточки, добавляет слушатель нажатия клавиши Esc
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.0
   * @see {@link Main}
   */
  handleAddPlaceClick = () => {
    document.activeElement.blur();
    document.addEventListener('keydown', this.handleEscClose);
    this.setState({ isAddPlacePopupOpen: true });
  };

  /**
   * @method handleAddPlaceSubmit
   * @description Обработчик сабмита формы добавления новой карточки<br>
   * Стрелочная функция, принимает аргументом объект с данными для создания карточки,
   * возвращает карточку, полученную с сервера
   * @param {Object} Object - объект с данными для создания карточки
   * @param {String} Object.name - название карточки
   * @param {String} Object.link - ссылка на изображение карточки
   * @returns {Object} - объект с данными карточки, полученный от сервера
   * @public
   * @memberof App
   * @instance
   * @since v.2.0.2
   * @see {@link AddPlacePopup}
   */
  handleAddPlaceSubmit = ({ name, link }) => {
    this.setState({ isLoading: true });
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        const obtainedCard = {
          id: newCard._id,
          link: newCard.link,
          title: newCard.name,
          likesQuantity: newCard.likes.length,
          owner: newCard.owner,
          likes: newCard.likes,
        };
        const resultCardsArr = this.state.cards.concat(obtainedCard);
        this.setState({ cards: resultCardsArr });
        this.closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  /**
   * @method handleRegister
   * @description Обработчик сабмита в форме регистрации<br>
   *  Собирает данные, введенные пользователем в форму, отправляет запрос на создание
   *  учетной записи пользователя, в случае успеха переадресовывает на форму входа в приложение.
   * @param {Oblect} userData - объект с данными пользователя из формы регистрации
   * @param {String} userData.email - емэйл (логин), введенный пользователем при регистрации
   * @param {String} userData.password - пароль, введенный пользователем при регистрации
   * @public
   * @memberof App
   * @instance
   * @since v.2.1.0
   * @see {@link Register}
   */
  handleRegister = ({ password, email }) => {
    this.setState({ isLoading: true });
    auth
      .register(password, email)
      .then((res) => {
        if (res) {
          this.props.history.push(TO_.SIGNIN);
        } else {
          this.setState(
            {
              loggedIn: false,
              isInfoToolTipOpen: true,
            },
            () => {
              console.log(res);
            },
          );
        }
      })
      .catch((err) => console.log(err))
      .finally(() => this.setState({ isLoading: false }));
  };

  /**
   * @method handleLogin
   * @description Обработчик сабмита в форме входа<br>
   * Собирает данные, введенные пользователем в форму, отправляет запрос на авторизацию пользователя,
   *  в случае успеха данные пользователя из формы, сохраняет токен, полученный в ответе от сервера,
   *  переадресовывает на главную страницу приложения.
   * @param {Object} userData - объект с данными пользователя из формы входа
   * @param {String} userData.login - емэйл (логин), введенный пользователем при входе
   * @param {String} userData.password - пароль, введенный пользователем при входе
   * @public
   * @memberof App
   * @instance
   * @since v.2.1.0
   * @see {@link Login}
   */
  handleLogin = ({ password, login }) => {
    this.setState({ isLoading: true });
    auth
      .authorize(password, login)
      .then((res) => {
        if (!res.token) {
          this.setState({
            loggedIn: false,
            isInfoToolTipOpen: true,
          });
        }
        setToken(res.token);
      })
      .then(() => {
        this.setState(
          {
            loggedIn: true,
            isInfoToolTipOpen: true,
          },
          () => {
            this.getContentWithTokenCheck();
            this.props.history.push(TO_.MAIN);
          },
        );
      })
      .catch((err) => console.log(err))
      .finally(() => this.setState({ isLoading: false }));
  };

  /**
   * @method tokenCheck
   * @description Метод проверки токена<br>
   * Если в локальном хранилище браузера сохранен токен, метод отправляет его на сервер для проверки
   *  его действительности. Если токен действующий - пользователь сразу автоматически авторизуется
   *  и перенаправляется на главную страницу приложения со своими учетными данными.
   * @public
   * @memberof App
   * @instance
   * @since v.2.1.0
   * @see {@link App}
   */
  getContentWithTokenCheck = () => {
    const token = getToken();
    if (token) {
      console.log('Token is already in LocalStoradge!');
      console.log('Here comes a data...');
      Promise.all([api.loadUserData(), api.loadCards()])
        .then(([currentUserData, initialCardsData]) => {
          this.setState({ currentUser: currentUserData });
          const initialCards = initialCardsData.map((initialCard) => ({
            id: initialCard._id,
            link: initialCard.link,
            title: initialCard.name,
            likesQuantity: initialCard.likes.length,
            owner: initialCard.owner,
            likes: initialCard.likes,
          }));
          this.setState(
            {
              currentUser: currentUserData,
              cards: initialCards,
              loggedIn: true,
            },
            () => {
              this.props.history.push(TO_.MAIN);
            },
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  /**
   * @method handleSignoutButtonClick
   * @description Обработчик клика по кнопке "Выйти"<br>
   * Пользователь выходит из профиля на форму входа, токен пользователя удаляется.
   *  Для входа в приложение требуется повторная авторизация.
   * @public
   * @memberof App
   * @instance
   * @since v.2.1.0
   * @see {@link NavBar}
   */
  handleSignoutButtonClick = () => {
    this.setState({ isMenuOpened: false, loggedIn: false });
    this.props.history.push(TO_.SIGNIN);
    removeToken();
  };

  /**
   * @method handleMenuButtonClick
   * @description Обработчик клика по кнопке открытия/закрытия меню<br>
   * Открывает или закрывает меню, содержащее ссылки на профил пользователя и выход из приложения.
   * @public
   * @memberof App
   * @instance
   * @since v.2.1.0
   * @see {@link NavBar}
   */
  handleMenuButtonClick = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  /**
   * При монтировании компонента загружаем с сервера актуальные данные профиля пользователя
   * и карточки
   * @ignore
   */
  componentDidMount() {
    console.log('Hello, we are working with token! Have a nice day!');
    this.getContentWithTokenCheck();
  }

  /**
   * @method render
   * @description Публичный метод<br>
   * Отрисовывает основные компоненты приложения.
   * @public
   * @instance
   * @memberof App
   * @since v.2.0.0
   * @this App
   */
  render() {
    return (
      <>
        <CurrentUserContext.Provider value={this.state.currentUser}>
          <NavBar
            handleSignoutButtonClick={this.handleSignoutButtonClick}
            email={this.state.currentUser.email}
            handleMenuClick={this.handleMenuButtonClick}
            isMenuOpened={this.state.isMenuOpened}
            isDropdownMenu={true}
          />

          <Header
            handleSignoutButtonClick={this.handleSignoutButtonClick}
            email={this.state.currentUser.email}
            handleMenuClick={this.handleMenuButtonClick}
            isMenuOpened={this.state.isMenuOpened}
            isDropdownMenu={false}
          />

          <Switch>
            <ProtectedRoute
              path={TO_.MAIN}
              exact
              loggedIn={this.state.loggedIn}
              onEditProfile={this.handleEditProfileClick}
              onAddPlace={this.handleAddPlaceClick}
              onEditAvatar={this.handleEditAvatarClick}
              onCardClick={this.handleCardClick}
              onCardLike={this.handleCardLike}
              onCardDelete={this.handleCardDelete}
              cards={this.state.cards}
              component={Main}
            />

            <Route path={TO_.SIGNUP}>
              <Register isLoading={this.state.isLoading} handleRegister={this.handleRegister} />
            </Route>

            <Route path={TO_.SIGNIN}>
              <Login isLoading={this.state.isLoading} handleLogin={this.handleLogin} />
            </Route>

            <Route path={TO_.MAIN}>
              {!this.state.loggedIn ? <Redirect to={TO_.SIGNIN} /> : <Redirect to={TO_.MAIN} />}
            </Route>
          </Switch>

          <Footer />

          <EditProfilePopup
            isOpen={this.state.isEditProfilePopupOpen}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            onUpdateUser={this.handleUpdateUser}
            isLoading={this.state.isLoading}
          />

          <EditAvatarPopup
            isOpen={this.state.isEditAvatarPopupOpen}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            onUpdateAvatar={this.handleUpdateAvatar}
            isLoading={this.state.isLoading}
          />

          <AddPlacePopup
            isOpen={this.state.isAddPlacePopupOpen}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            onSubmit={this.handleAddPlaceSubmit}
            isLoading={this.state.isLoading}
          />

          <DeleteConfirmPopup
            isOpen={this.state.isDeleteConfirmPopupOpen}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            onSubmit={this.handleDeleteConfirm}
            isProcessing={this.state.isLoading}
          />

          <ImagePopup
            card={this.state.selectedCard}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            isOpen={this.state.isImagePopupOpen}
          />

          <InfoToolTip
            isOpen={this.state.isInfoToolTipOpen}
            onClose={this.closeAllPopups}
            onOverlayClick={this.handleClickOnOverlay}
            loggedIn={this.state.loggedIn}
          />
        </CurrentUserContext.Provider>
      </>
    );
  }
}

export default withRouter(App);
