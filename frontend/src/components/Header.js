import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import NavBar from "./NavBar";
import headerLogoPath from "../images/headerLogo.svg";
import { SIGNIN, SIGNUP, MAIN } from "../utils/routesMap";
import PropTypes from "prop-types";

/**
 * @module Header
 * @description Функциональный React-компонент Header<br>
 * Принимает объект параметров - props<br>
 * Возвращает JSX-фрагмент разметки - "шапку" страницы приложения
 * @param {Object} props - объект параметров
 * @param {String} props.signupLinkText - текст ссылки на регистрацию.
 *  <b>Не обязательный пропс. Значение по умолчанию: "Регистрация"</b>
 * @param {String} props.signinLinkText - текст ссылки на авторизацию.
 *  <b>Не обязательный пропс. Значение по умолчанию: "Войти"</b>
 * @param {Object} props....props - пропсы, пробрасываемые в компонент NavBar
 * @returns {JSX} - JSX-фрагмент разметки, блок Header
 * @see {@link NavBar}
 * @since v.2.0.0
 */
function Header({ signupLinkText, signinLinkText, ...props }) {
  return (
    <header className="header page__header">
      <img
        className="header__logo"
        src={headerLogoPath}
        alt="логотип проекта 'Место-Россия'"
      />
      <Switch>
        <Route path={SIGNIN}>
          <Link to={SIGNUP} className="header__link">
            {signupLinkText}
          </Link>
        </Route>
        <Route path={SIGNUP}>
          <Link to={SIGNIN} className="header__link">
            {signinLinkText}
          </Link>
        </Route>
        <Route path={MAIN} exact>
          <NavBar {...props} />
        </Route>
      </Switch>
    </header>
  );
}

Header.propTypes = {
  signupLinkText: PropTypes.string,
  signinLinkText: PropTypes.string,
};

Header.defaultProps = {
  signupLinkText: "Регистрация",
  signinLinkText: "Войти",
};

export default Header;
