import React from "react";
import { Route, Link, Switch } from "react-router-dom";
import { SIGNIN, SIGNUP } from "../utils/routesMap";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * @module StartPageWithForm
 * @description Функциональный React-компонент<br>
 * Стартовая страница. Пропсами определяется тип страницы: страница авторизации или регистрации.
 *  Поля формы одинаковы для обоих типов страницы и также передаются в пропсах JSX-фрагментом.
 * @param {Object} props - пропсы, принимаемые компонентом
 * @param {String} props.name - название, которое будет присвоено форме компонента.
 * @param {String} props.title - заголовок формы
 * @param {Function} props.onSubmit -функция-коллбэк, вызывается при сабмите формы.
 * @param {Boolean} props.isLoading - индикатор состояния загрузки, используется для информирования пользовтаеля
 *  о том, что инициированный им процесс выполняется
 * @param {String} props.submitButtonText - текст, который будет отображаться на кнопке submit.
 *  <b>Не обязательный пропс. Значение по умолчанию: "Отправить"</b>
 * @param {String} props.preloaderText - текст, отображаемый на кнопке сабмит во время загрузки, т.е. когда isLoading: true
 *  <b>Не обязательный пропс. Значение по умолчанию: "Выполняется..."</b>
 * @param {String} props.redirectTitleText - текст, перед перенаправляющей ссылкой (не текст ссылки)
 *  <b>Не обязательный пропс. Значение по умолчанию: "Уже зарегистрированы? "</b>
 * @param {String} props.redirectLinkText - текст непосредственно перенаправляющей ссылки
 *  <b>Не обязательный пропс. Значение по умолчанию: "Войти"</b>
 * @param {JSX} props.children - JSX - фрагмент
 * @returns {JSX} - JSX - фрагмент, страница регистрации или авторизации
 * @since v.2.1.0
 */
function StartPageWithForm({
  name,
  title,
  onSubmit,
  isDisabled,
  isLoading,
  submitButtonText,
  preloaderText,
  redirectTitleText,
  redirectLinkText,
  children,
}) {
  const formClassName = classNames(
    "form",
    "start-page-container__form",
    `form_type_${name}`
  );

  const submitButtonClassName = classNames(
    "button",
    "form__submit-button",
    "form__submit-button_type_start",
    {
      "button_type_submit-inactive": isDisabled,
      "button_type_submit-start": !isDisabled,
    }
  );

  return (
    <div className="start-page-container page__start-page-container">
      <form
        onSubmit={onSubmit}
        className={formClassName}
        name={`${name}-form`}
        id={`${name}-form`}
      >
        <h2 className="form__title form__title_type_start">{title}</h2>
        {children}
        <button
          type="submit"
          disabled={isDisabled}
          className={submitButtonClassName}
          name={`${name}-button`}
          value={submitButtonText}
        >
          {isLoading ? preloaderText : submitButtonText}
        </button>
        <Switch>
          <Route path={SIGNUP}>
            <p className="form__redirect-title">
              {redirectTitleText}
              <Link to={SIGNIN} className="form__redirect-link">
                {redirectLinkText}
              </Link>
            </p>
          </Route>
          <Route path={SIGNIN}>
            <p className="form__redirect-title hidden-block">
              {redirectTitleText}
              <Link to="#" className="form__redirect-link hidden-block">
                {redirectLinkText}
              </Link>
            </p>
          </Route>
        </Switch>
      </form>
    </div>
  );
}

StartPageWithForm.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  submitButtonText: PropTypes.string,
  preloaderText: PropTypes.string,
  redirectTitleText: PropTypes.string,
  redirectLinkText: PropTypes.string,
  children: PropTypes.node.isRequired,
};

StartPageWithForm.defaultProps = {
  submitButtonText: "Отправить",
  preloaderText: "Выполняется...",
  redirectTitleText: "Уже зарегистрированы? ",
  redirectLinkText: "Войти",
};

export default StartPageWithForm;
