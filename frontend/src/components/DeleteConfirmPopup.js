import React from "react";
import PopupWithForm from "./PopupWithForm";
import PropTypes from 'prop-types';
/**
 * @module DeleteConfirmPopup
 * @description Функциональный React-компонент<br>
 * Запрашивает подтверждение удаления карточки<br>
 * Принимает объект параметров props<br>
 * Возвращает JSX-фрагмент разметки попапа  подтверждения удаления карточки
 * @param {Object} props - объект параметров
 * @param {Function} props.onClose - функция-коллбэк, закрывает попап
 * @param {Function} props.onOverlayClick - функция-коллбэк, вызывается при клике по оверлею, закрывает попап
 * @param {Function} props.onSubmit - функция-коллбэк сабмита попапа, удаляет карточку
 * @param {Boolean} props.isOpen - индикатор состояния попапа, управляет его видимостью:<br>
 *  - true - попап открыт<br>
 *  - false - попап закрыт
 * @param {Boolean} props.isProcessing - индикатор статуса процесса удаления карточки:
 * true - карточка удаляется, false - ожидается подтверждение удаления карточки или отмена<br>
 * <b>Не обязательный пропс</b>
 * @see {@link PopupWithForm}
 * @since v.2.0.4
 */
function DeleteConfirmPopup({
  onClose,
  onOverlayClick,
  isOpen,
  onSubmit,
  isProcessing,
}) {
  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      submitButtonText="Да"
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      isOpen={isOpen}
      onSubmit={onSubmit}
      isLoading={isProcessing}
      preloaderText="Удаление..."
      isDisabled={false}
    />
  );
}

DeleteConfirmPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOverlayClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default DeleteConfirmPopup;
