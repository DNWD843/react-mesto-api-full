import React, { useEffect } from "react";
import { useFormWithValidation } from "../hooks/useFormWithValidation";
import StartPageWithForm from "./StartPageWithForm";
import PropTypes from "prop-types";

/**
 * @module Login
 * @description Функциональный React-компонент<br>
 * Форма входа (авторизации) на стартовой странице приложения. После выхода из
 *  приложения пользователь имеет возможность сразу повторно войти в приложение не вводя
 *  свои учетные данные, т.к. они сохранены и вставлены в поля форму. Однако, если пользователь
 *  обновит страницу или закроет ее - данные сотрутся, форма очистится, потребуется повторная авторизация.
 * @param {Object} props - пропсы, принимаемые компонентом
 * @param {Boolean} props.isLoading - индикатор состояния загрузки, используется для информирования пользовтаеля
 *  о том, что инициированный им процесс выполняется. <b>Не обязательный пропс</b>
 * @param {Function} props.handleLogin - функция-коллбэк, вызывается при сабмите формы входа, отправляет данные
 *  пользователя на сервер для проверки его регистрации и получения токена.
 * @param {Object} props.userData - объект с данными пользователя. Принимаются для подстановки в форму входа,
 * если пользователь выходит из приложения.
 * @param {String} props.userData.login - емэйл (логин), введенный пользователем при входе
 * @param {String} props.userData.password - пароль, введенный пользователем при входе
 * @returns {JSX} - JSX-фрагмент разметки, форма авторизации в приложении
 * @since v.2.1.0
 */
function Login({ isLoading, handleLogin, userData }) {
  const {
    values,
    errors,
    isValid,
    handleInputChange,
    resetForm,
  } = useFormWithValidation();

  const { login, password } = values;

  /**
   * @method handleSubmit
   * @argument {Event} evt - событие
   * @description Обработчик сабмита формы входа<br>
   * Вызывает метод handleLogin, полученный из props.
   * @public
   * @since v.2.0.6
   */
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const userData = { password, login };
    handleLogin(userData);
  };

  /**
   * При первом выходе из приложения пользовательские данные подставляются в форму, пользователь может
   *  сразу войти обратно. После обновления страницы данные сотрутся.
   * @ignore
   */
  useEffect(() => {
    resetForm(
      {
        login: userData.email,
        password: userData.password,
      },
      {}
    );
    //eslint-disable-next-line
  }, []);

  return (
    <StartPageWithForm
      name="login"
      title="Вход"
      onSubmit={handleSubmit}
      isDisabled={!isValid}
      isLoading={isLoading}
      submitButtonText="Войти"
      preloaderText="Выполняется вход..."
    >
      <>
        <ul className="form__inputs form__inputs_type_start">
          <li className="form__field form__field_type_start">
            <input
              id="user-login"
              name="login"
              type="email"
              onChange={handleInputChange}
              onFocus={handleInputChange}
              value={login || ""}
              className="form__input form__input_type_start form__input_type_user-login"
              placeholder="Email"
              required
            />
            <span className="form__input-error" id="user-login-input-error">
              {errors.login || ""}
            </span>
          </li>
          <li className="form__field">
            <input
              id="user-password"
              name="password"
              type="password"
              onChange={handleInputChange}
              onFocus={handleInputChange}
              value={password || ""}
              className="form__input form__input_type_start form__input_type_user-password"
              placeholder="Пароль"
              required
              minLength="3"
              maxLength="35"
            />
            <span className="form__input-error" id="user-password-input-error">
              {errors.password || ""}
            </span>
          </li>
        </ul>
      </>
    </StartPageWithForm>
  );
}

Login.propTypes = {
  isLoading: PropTypes.bool,
  handleLogin: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

export default Login;
