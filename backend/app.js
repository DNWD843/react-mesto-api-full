const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rootRouter = require('./routes/root');

const { PORT = 3000 } = process.env;

/**
 * @module app
 * @description Точка входа бэкенда, express-сервер.
 * @since v.1.0.0
 */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Временно захардкорили _id автора карточки. Исправим в спринте 14.
 * @ignore
 */
app.use((req, res, next) => {
  req.user = {
    _id: '5f9464fa58695029a0324dcc',
    /* Юзеры для проверки лайков:
    5f94813a32cd6e52c8d1c065
    5f958f119d837851d8e46853
    5f9464fa58695029a0324dcc default user */
  };
  next();
});

app.use(rootRouter);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error(`Can't start app ${err.toString()}`);
});
