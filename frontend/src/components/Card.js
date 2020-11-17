import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * @module Card
 * @description Функциональный React-компонент<br>
 * Декларирует отрисовку карточки<br>
 * Принимает объект параметров - props<br>
 * Возвращает JSX-фрагмент разметки - карточку, заполненный данными карточки<br>
 * @param {Object} props - объект с параметрами и переданными функциями-коллбэками
 * @param {String} props.id - уникальный идентификатор карточки, присваивается карточке сервером.<br>
 * <b>ПРИМЕЧАНИЕ: props.id используется при отрисовке компонента Card для присвоения обязательному параметру key</b>
 * @param {String} props.link - ссылка на изображение
 * @param {String} props.title - название изображения
 * @param {Number} props.likesQuantity - количество лайков
 * @param {Object} props.owner - объект, данные о владельце карточки
 * @param {Array} props.likes - массив, содержит id всех пользователей, лайкнувших карточку
 * @param {Function} props.onCardClick - функция-колбэк, вызывается при клике по изображению карточки,
 * открывает попап с полноразмерным изображением карточки<br>
 * Принимает аргументом объект с названием карточки и ссылкой на изображение для дальнейшей передачи
 * этих параметров в ImagePopup
 * @param {Function} props.onCardLike -  функция-колбэк, вызывается при клике по "лайку" карточки,
 * ставит/снимает "лайки", принимает аргументом объект с id карточки и массивом лайков карточки
 * @param {Function} props.onCardDelete - функция-колбэк, вызывается при клике по иконке удаления карточки,
 * открывает попап подтверждения удаления, принимает аргументом объект с id карточки
 * @returns {JSX} - JSX-фрагмент разметки, элемент card
 * @since v.2.0.0
 */
function Card({
  id,
  link,
  title,
  likesQuantity,
  owner,
  likes,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = owner._id === currentUser._id;

  const isLiked = likes.some((likeOwner) => likeOwner._id === currentUser._id);

  const cardDeleteButtonClassName = classNames(
    "button",
    "button_type_delete",
    "card__delete-button",
    isOwn && "card__delete-button_enabled"
  );

  const cardLikeButtonClassName = classNames(
    "button",
    "button_type_like",
    "card__like-button",
    {
      "button_like-status_checked": isLiked,
      "button_like-status_not-checked": !isLiked,
    }
  );

  /**
   * @method handleImageClick
   * @description Обработчик клика по изображению карточки, вызывает коллбэк props.onCardClick и передает ему данные карточки
   * @argument {Object} object - объект с данными карточки, аргумент коллбэка props.onCardClick
   * @param {String} object.link - ссылка на изображение кликнутой карточки
   * @param {String} object.title - название кликнутой карточки
   * @public
   * @since v.2.0.0
   */
  const handleImageClick = () => {
    onCardClick({ link, title });
  };

  /**
   * @method handleLikeClick
   * @description Обработчик клика по "лайку" карточки, вызывает коллбэк props.onCardLike и передает ему данные карточки
   * @argument {Object} object - объект с данными карточки, аргумент коллбэка props.onCardLike
   * @param {String} object.id - id лайкнутой карточки
   * @param {String} object.likes - массив "лайков" лайкнутой карточки
   * @public
   * @since v.2.0.2
   */
  const handleLikeClick = () => {
    onCardLike({ id, likes });
  };

  /**
   * @method handleDeleteClick
   * @description Обработчик клика по иконке "удалить", вызывает коллбэк props.onCardDelete и передает ему id карточки
   * @argument {Object} object - объект с данными удаляемой карточки, аргумент коллбэка props.onCardDelete
   * @param {String} object.id - id удаляемой карточки
   * @public
   * @since v.2.0.2
   */
  const handleDeleteClick = () => {
    onCardDelete({ id });
  };

  return (
    <li className="card">
      <img
        className="card__image"
        onClick={handleImageClick}
        src={link}
        alt={title}
        name="photo"
        title="Открыть фото"
      />
      <button
        type="button"
        onClick={handleDeleteClick}
        className={cardDeleteButtonClassName}
        name="delete-button"
        value="delete"
        title="Удалить фото"
      ></button>
      <div className="card__description">
        <h2 className="card__title">{title}</h2>
        <div className="card__like-info">
          <button
            type="button"
            onClick={handleLikeClick}
            className={cardLikeButtonClassName}
            name="like-button"
            value="like"
          ></button>
          <span className="card__like-counter">{likesQuantity}</span>
        </div>
      </div>
    </li>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  likesQuantity: PropTypes.number.isRequired,
  owner: PropTypes.object.isRequired,
  likes: PropTypes.array.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onCardLike: PropTypes.func.isRequired,
  onCardDelete: PropTypes.func.isRequired,
};

export default Card;
