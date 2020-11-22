import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

/**
 * @module index
 * @description Файл index.js - точка входа для всего приложения<br>
 * Метод ReactDOM.render() - отрисовывает главный компонент приложения App в DOM
 */
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
