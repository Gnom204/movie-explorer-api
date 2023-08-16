/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errorLogger } = require('express-winston');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PORT, MONGO_URL } = require('./config');
const router = require('./routes');
const { requestLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const { HTTP_STATUS_NOT_FOUND } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const allowedCors = require('./middlewares/corsProtect');
const limiter = require('./utils/limiter');

const app = express();

mongoose.connect(MONGO_URL);
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(cors({
  origin: allowedCors,
  credentials: true,
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
