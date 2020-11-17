import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * @module ImagePopup
 * @description Функциональный React-компонент<br>
 * Открывает изображение карточки в полном размере<br>
 * Принимает объект параметров - props<br>
 * Возвращает JSX-фрагмент разметки - попап с полноразмерным изображением карточки<br>
 * @param {Object} props - объект с параметрами и переданными функциями-коллбэками
 * @param {Object} props.card - объект с данными карточки
 * @param {String} props.card.link - ссылка на изображение карточки
 * @param {String} props.card.title - название карточки
 * @param {Function} props.onClose - функция-коллбэк, вызывается при клике по иконке закрытия попапа, закрывает попап
 * @param {Function} props.onOverlayClick - функция-коллбэк, вызывается при клике по оверлею, закрывает попап
 * @param {Boolean} props.isOpen - индикатор состояния попапа, управляет его видимостью:<br>
 *  - true - попап открыт<br>
 *  - false - попап закрыт
 * @returns {JSX} - JSX-фрагмент разметки, попап с полноразмерным изображением карточки
 * @since v.2.0.0
 */
function ImagePopup({ onOverlayClick, onClose, isOpen, card }) {
  const popupClassName = classNames(
    "popup",
    "page__overlay",
    "page__overlay_theme_dark",
    "popup_type_view-photo",
    isOpen && "popup_opened"
  );

  const popupCloseButtonClassName = classNames(
    "button",
    "button_type_close",
    "popup__close-button",
    "popup__close-button_type_photo"
  );

  return (
    <div onClick={onOverlayClick} className={popupClassName} id="view">
      <div className="popup__container">
        <button
          type="button"
          onClick={onClose}
          className={popupCloseButtonClassName}
          name="close-photo"
          value="Закрыть фото"
        ></button>
        <figure className="popup__photo-content">
          <img
            className="popup__place-image"
            src={`${card ? card.link : "#"}  `}
            alt={`${card ? card.title : "изображение"}`}
          />
          <figcaption className="popup__place-name">{`${
            card ? card.title : "изображение"
          }`}</figcaption>
        </figure>
      </div>
    </div>
  );
}

ImagePopup.propTypes = {
  onOverlayClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  card: PropTypes.object.isRequired,
};

export default ImagePopup;
