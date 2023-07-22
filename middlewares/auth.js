/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { secretKey } = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
  req.user = payload;
  next(); // пропускаем запрос дальше
};
module.exports = auth;
