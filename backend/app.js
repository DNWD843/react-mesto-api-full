require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rootRouter = require('./routes/root');
const handleErrors = require('./middlewares/handleErrors');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

/**
 * @module app
 * @description Точка входа бэкенда, express-сервер.
 * @since v.1.0.0
 */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
/*
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  //allowedHeaders: ['Content-Type', 'origin', 'x-access-token', 'X-Requested-With'],
  credentials: true,
};

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  const allowedCors = ['localhost:3000', 'http://localhost:3000'];
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    // Проверяем, что значение origin есть среди разрешённых доменов
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});*/
//app.options('*', cors());
//app.use(cors());
//**************************************************************************************** */
//app.use(express.static(path.join(__dirname, 'public')));
//******************************************************************************************** */

//});
app.use(cors());

//==============================================================================
/*const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'x-access-token', 'X-Requested-With'],
  credentials: true,
};
*/
//app.use(cors(corsOptions));
//===============================================================================

app.use(requestLogger);
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
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Can't start app ${err.toString()}`);
  });
