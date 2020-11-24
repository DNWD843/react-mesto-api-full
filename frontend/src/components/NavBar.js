import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * @module NavBar
 * @description Функциональный React-компонент<br>
 * Представляет собой меню со ссылками на профиль пользователя и выход из приложения.<br>
 * Меню ссылок NavBar  определяется в двух местах приложения:<br>
 *  * над хэдером - для мобильных разрешений;<br>
 *  * в хэдере - для десктопных разрешений.<br>
 *  На мобильных разрешениях меню скрыто над хэдером, выезжает сверху вниз при нажатии на кнопку управления меню,
 *  расположенную в хэдере(меню из десктопных разрешений преобразуется в кнопку)<br>
 *  На десктопных разрешениях расположено в хэдере, представляет собой меню со ссылками без кнопки открытия/закрытия,
 *  меню для мобильных разрешений (над хэдером) на десктопных разрешениях отключено.<br>
 * Анимация выезда меню сверху и трансформация меню в хэдере в кнопку управления реализованы средствами CSS.
 * (См. blocks\navbar)
 * @param {Object} props - пропсы, принимаемые компонентом
 * @param {String} props.email - емэйл (логин), введенный пользователем при входе в приложение
 * @param {Function} props.handleSignoutButtonClick - функция-коллбэк, вызывается при клике по "Выйти", выход из профиля
 * на страницу входа (авторизации)
 * @param {String} props.signOutButtonText - текст, который будет отображен на кнопке выхода из профиля. <b>Не обязательный пропс.
 *  Значение по умолчанию: "Выйти"</b>
 * @param {Function} props.handleMenuClick - функция-коллбэк, вызывается при клике по иконке "Меню", открывает или
 *  закрывает меню на мобильных разрешениях
 * @param {Boolean} props.isMenuOpened - индикатор состояния меню:<br>
 *  - true - меню открыто<br>
 *  - false - меню закрыто
 * @param {Boolean} props.isDropdownMenu - пропс, определяющий как будет отрисован компонент:<br>
 *  - true - для мобильных разрешений экрана(на десктопных разрешениях меню скрыто), меню будет отрисовано как выпадающее меню,
 *  при этом меню из десктопных разрешений преобразуется в кнопку управления<br>
 *   - false - для десктопных разрешений (на мобильных разрешениях меню преобразуется в кнопку управления меню), меню будет
 *  отрисовано статичным списком ссылок без кнопки открытия/закрытия.<br>
 * <b>Внимание!</b> Этот пропс задается вручную и не является стейтом.
 * @returns {JSX}
 * @since v.2.1.0
 */
function NavBar({
  email,
  handleSignoutButtonClick,
  signOutButtonText,
  handleMenuClick,
  isMenuOpened,
  isDropdownMenu,
}) {
  const navbarClassName = classNames("navbar", {
    navbar_type_mobile: isDropdownMenu,
    navbar_opened: isDropdownMenu && isMenuOpened,
  });

  const menuButtonClassName = classNames("button", "navbar__menu-button", {
    "navbar__menu-button_type_close": isMenuOpened,
    "navbar__menu-button_type_open": !isMenuOpened,
  });

  return (
    <>
      <ul className={navbarClassName}>
        <li className="navbar__item">
          <Link to="#" className="navbar__link">
            {email}
          </Link>
        </li>
        <li className="navbar__item">
          <button
            onClick={handleSignoutButtonClick}
            className="button button_type_signout navbar__button-signout"
          >
            {signOutButtonText}
          </button>
        </li>
      </ul>
      {!isDropdownMenu && (
        <button
          type="button"
          title="Меню"
          onClick={handleMenuClick}
          className={menuButtonClassName}
        ></button>
      )}
    </>
  );
}

NavBar.propTypes = {
  email: PropTypes.string,
  handleSignoutButtonClick: PropTypes.func.isRequired,
  signOutButtonText: PropTypes.string,
  handleMenuClick: PropTypes.func.isRequired,
  isMenuOpened: PropTypes.bool.isRequired,
  isDropdownMenu: PropTypes.bool.isRequired,
};

NavBar.defaultProps = {
  signOutButtonText: "Выйти",
};

export default NavBar;
