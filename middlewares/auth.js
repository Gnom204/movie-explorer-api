/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { secretKey, HTTP_STATUS_UNAUTHORIZED_REQUEST } = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookie.jwt;
  if (!token) {
    next(new UnauthorizedError(HTTP_STATUS_UNAUTHORIZED_REQUEST.message));
  }
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new UnauthorizedError(HTTP_STATUS_UNAUTHORIZED_REQUEST.message));
  }
  req.user = payload;
  next(); // пропускаем запрос дальше
};
module.exports = auth;
