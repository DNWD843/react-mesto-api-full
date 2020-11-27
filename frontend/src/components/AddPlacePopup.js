import React from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
 * @module AddPlacePopup
 * @description Функциональный React-компонент<br>
 * Добавляет карточку в приложение<br>
 * Для успешного добавления карточки пользователь должен ввести корректные данные:
 *  название карточки (изображения) и ссылку (url-адрес) на изображение<br>
 * Принимает объект параметров props<br>
 * Возвращает JSX-фрагмент разметки попапа добавления карточки<br>
 * @param {Object} props - объект параметров
 * @param {Function} props.onClose - функция-коллбэк, закрывает попап
 * @param {Function} props.onOverlayClick - функция-коллбэк, вызывается при клике по оверлею,
 *  закрывает попап
 * @param {Function} props.onSubmit - функция-коллбэк, добавляет карточки в приложение при
 *  успешном сабмите формы добавления карточки
 * @param {Boolean} props.isOpen - индикатор состояния попапа, управляет его видимостью:<br>
 *  - true - попап открыт<br>
 *  - false - попап закрыт
 * @param {Boolean} props.isLoading - индикатор состояния загрузки новой карточки,
 *  управляет отображением прелоадера загрузки:<br>
 *  - true - идет загрузка, отображется текст-прелоадер на кнопке сабмит;<br>
 *  - false - нет загрузки, на кнопке сабмит дефолтный текст<br> <b>Не обязательный пропс</b>
 * @public
 * @see {@link PopupWithForm}
 * @since v.2.0.2
 */
function AddPlacePopup({ isOpen, isLoading, onClose, onOverlayClick, onSubmit }) {
  const {
    values,
    errors,
    isFormValid,
    isInputChecked,
    isInputValid,
    handleInputChange,
    resetForm,
  } = useFormWithValidation();

  const { title, link } = values;

  const placeTitleInputName = 'title';
  const imageLinkInputName = 'link';

  const placeTitleInputClassName = classNames('form__input', 'form__input_type_place-title', {
    form__input_type_error:
      isInputChecked[placeTitleInputName] && !isInputValid[placeTitleInputName],
  });
  const imageLinkInputClassName = classNames('form__input', 'form__input_type_image-link', {
    form__input_type_error: isInputChecked[imageLinkInputName] && !isInputValid[imageLinkInputName],
  });

  /**
   * @method handleSubmit
   * @argument {Event} evt - событие
   * @description Обработчик сабмита формы добавления новой карточки<br>
   * Вызывает метод onSubmit, полученный из props.
   * @public
   * @since v.2.0.6
   */
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit({ name: title, link });
  };

  React.useEffect(() => {
    resetForm();
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add-photo"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isDisabled={!isFormValid}
    >
      <ul className="form__inputs">
        <li className="form__field">
          <input
            id="place-title-input"
            name={placeTitleInputName}
            type="text"
            onChange={handleInputChange}
            value={title || ''}
            className={placeTitleInputClassName}
            placeholder="Название"
            required
            minLength="3"
            maxLength="30"
          />
          <span className="form__input-error">{errors.title}</span>
        </li>
        <li className="form__field">
          <input
            id="image-link-input"
            name={imageLinkInputName}
            type="url"
            onChange={handleInputChange}
            value={link || ''}
            className={imageLinkInputClassName}
            placeholder="Ссылка на картинку"
            required
          />
          <span className="form__input-error">{errors.link}</span>
        </li>
      </ul>
    </PopupWithForm>
  );
}

AddPlacePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOverlayClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddPlacePopup;
