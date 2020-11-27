import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useFormWithValidation } from '../hooks/useFormWithValidation';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * @module EditProfilePopup
 * @description Функциональный React-компонент<br>
 * Редактирует данные профиля пользователя<br>
 * Для успешного изменения профиля пользователь должен ввести валидные данные в поля "Имя" и "О себе"<br>
 * Принимает объект параметров props<br>
 * Возвращает JSX-фрагмент разметки попапа редактирования профиля пользователя<br>
 * @param {Object} props - объект с параметрами
 * @param {Function} props.onClose - функция-коллбэк, закрывает попап
 * @param {Function} props.onOverlayClick - функция-коллбэк, вызывается при клике по оверлею, закрывает попап
 * @param {Function} props.onUpdateUser -  функция-коллбэк, обновляет данные профиля пользователя
 * при успешном сабмите формы редактирования профиля
 * @param {Boolean} props.isOpen - индикатор состояния попапа, управляет его видимостью:<br>
 *  - true - попап открыт<br>
 *  - false - попап закрыт
 * @param {Boolean} props.isLoading - индикатор состояния загрузки новых данных профиля пользователя,
 * управляет отображением прелоадера загрузки:<br>
 *  - true - идет загрузка, отображется текст-прелоадер на кнопке сабмит;<br>
 *  - false - нет загрузки, на кнопке сабмит дефолтный текст;<br> <b>Не обязательный пропс</b>
 * @returns {JSX} - JSX-фрагмент разметки, попап редактирования профиля пользователя
 * @see {@link PopupWithForm}
 * @since v.2.0.2
 */
function EditProfilePopup({ isOpen, isLoading, onClose, onOverlayClick, onUpdateUser }) {
  const {
    values,
    errors,
    isFormValid,
    isInputChecked,
    isInputValid,
    handleInputChange,
    resetForm,
  } = useFormWithValidation();

  const currentUser = React.useContext(CurrentUserContext);

  const { name, description } = values;

  const userNameInputName = 'name';
  const userDescriptionInputName = 'description';

  const userNameInputClassName = classNames('form__input', 'form__input_type_name', {
    form__input_type_error: isInputChecked[userNameInputName] && !isInputValid[userNameInputName],
  });
  const userDescriptionInputClassName = classNames('form__input', 'form__input_type_description', {
    form__input_type_error:
      isInputChecked[userDescriptionInputName] && !isInputValid[userDescriptionInputName],
  });

  /**
   * @method handleSubmit
   * @argument {Event} evt - событие
   * @description Обработчик сабмита формы добавления новой карточки<br>
   * Вызывает метод onUpdateUser, полученный из props.
   * @public
   * @since v.2.0.6
   */
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  };

  React.useEffect(() => {
    resetForm(
      {
        name: currentUser.name,
        description: currentUser.about,
      },
      {},
      true,
    );
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      submitButtonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onOverlayClick}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isDisabled={!isFormValid}
    >
      <>
        <ul className="form__inputs">
          <li className="form__field">
            <input
              id="user-name-input"
              name={userNameInputName}
              type="text"
              onChange={handleInputChange}
              value={name || ''}
              className={userNameInputClassName}
              placeholder="Имя"
              required
              minLength="1"
              maxLength="30"
            />
            <span className="form__input-error" id="edit-profile-input-error">
              {errors.name || ''}
            </span>
          </li>
          <li className="form__field">
            <input
              id="user-job-input"
              name={userDescriptionInputName}
              type="text"
              onChange={handleInputChange}
              value={description || ''}
              className={userDescriptionInputClassName}
              placeholder="О себе"
              required
              minLength="3"
              maxLength="35"
            />
            <span className="form__input-error" id="edit-profile-input-error">
              {errors.description || ''}
            </span>
          </li>
        </ul>
      </>
    </PopupWithForm>
  );
}

EditProfilePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOverlayClick: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func.isRequired,
};

export default EditProfilePopup;
