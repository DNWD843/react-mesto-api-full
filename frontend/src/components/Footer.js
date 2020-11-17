import React from "react";
import { Route } from "react-router-dom";
import { MAIN } from "../utils/routesMap";

/**
 * @module Footer
 * @description Функциональный React-компонент Footer<br>
 * Возвращает JSX-фрагмент разметки - "подвал" страницы приложения
 * @returns {JSX} - JSX-фрагмент разметки, блок Footer
 * @since v.2.0.0
 */
function Footer() {
  return (
    <Route path={MAIN} exact>
      <footer className="footer">
        <p className="footer__copyright">&#169; 2020 Mesto Russia</p>
      </footer>
    </Route>
  );
}

export default Footer;
