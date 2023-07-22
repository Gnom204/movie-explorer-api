/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const { errorLogger } = require('express-winston');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PORT = 3000 } = require('./config');
const router = require('./routes');
const { requestLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const { HTTP_STATUS_NOT_FOUND } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const allowedCors = require('./middlewares/corsProtect');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/diplomdb');
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(cors({
  credentials: true,
  origin: allowedCors,
}));
app.use(router);
app.use(() => {
  throw new NotFoundError(HTTP_STATUS_NOT_FOUND.message);
});
app.use(errorLogger);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
