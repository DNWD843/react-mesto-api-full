require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const rootRouter = require('./routes/root');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

/**
 * @module app
 * @description Точка входа бэкенда, express-сервер.
 * @since v.1.0.0
 */
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// краш-тест сервера
// TODO: удалить после ревью!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(rootRouter);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line
    console.error(`Can't start app ${err.toString()}`);
  });
