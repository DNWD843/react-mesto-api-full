import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';
import PropTypes from 'prop-types';

/**
 * @module Main
 * @description Функциональный React-компонент<br>
 * Декларирует отрисовку основного контента приложения: профиль пользователя, карточки с изображениями<br>
 * В компонент Main импортируются:<br>
 *  - api - экземпляр класса Api <br>
 *  - Card - компонент Card<br>
 * Принимает объект параметров - props<br>
 * Возвращает JSX-фрагмент разметки основного контента приложения
 * @param {Object} props - объект с переданными функциями-коллбэками
 * @param {Function} props.onAddPlace - функция-коллбэк, вызывается при клике по кнопке "Добавить фото", открывает попап добавления карточки
 * @param {Function} props.onCardClick - функция-коллбэк, вызывается при клике по изображению карточки, открывает попап с полноразмерным изображением карточки<br>
 * <b>ПРИМЕЧАНИЕ</b> В компоненте Main не используется. Через пропсы компонента Main пробрасывается в компонент Card.
 * @param {Function} props.onEditAvatar - функция-коллбэк, вызывается при клике по аватару пользователя, открывает попап редактирования аватара пользователя
 * @param {Function} props.onEditProfile - функция-коллбэк, вызывается при клике по кнопке "Редактировать профиль", открывает попап редактирования профиля
 * @param {Function} props.onCardDelete - функция-коллбэк, вызывается при клике по иконке удаления карточки, открывает попап подтверждения удаления карточки
 * @param {Function} props.onCardLike - функция-коллбэк, вызывается при клике по "лайку" карточки, ставит или удаляет "лайк", в зависимости от его состояния
 * @param {Array} props.cards - массив объектов(карточек)
 * @returns {JSX} - JSX-фрагмент разметки, блок main
 * @see {@link Api}
 * @see {@link Card}
 * @since v.2.0.0
 */
function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content page__content">
      <section className="user-profile content__user-profile" key="user-profile">
        <button
          type="button"
          onClick={onEditAvatar}
          className="button  user-profile__avatar-button"
          style={{ backgroundImage: `url(${currentUser.avatar})` }}
          name="edit-avatar-form-button"
          id="edit-avatar-form-button"
          value="Добавить аватар"
          title="Изменить аватар"
        ></button>
        <div className="user-profile__user-info">
          <h1 className="user-profile__user-name">{currentUser.name}</h1>
          <button
            type="button"
            onClick={onEditProfile}
            className="button button_type_edit user-profile__edit-button"
            name="edit-profile-form-button"
            id="edit-profile-form-button"
            value="Открыть форму"
            title="Редактировать профиль"
          ></button>
          <p className="user-profile__user-job">{currentUser.about}</p>
        </div>
        <button
          type="button"
          onClick={onAddPlace}
          className="button button_type_add user-profile__add-button"
          name="add-photo-form-button"
          id="add-photo-form-button"
          value="Добавить фото"
          title="Добавить фото"
        ></button>
      </section>

      <section className="photo content__photo" key="photo-cards">
        <ul className="photo__cards">
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

Main.propTypes = {
  onEditAvatar: PropTypes.func.isRequired,
  onEditProfile: PropTypes.func.isRequired,
  onAddPlace: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onCardLike: PropTypes.func.isRequired,
  onCardDelete: PropTypes.func.isRequired,
  cards: PropTypes.array.isRequired,
};

export default Main;
