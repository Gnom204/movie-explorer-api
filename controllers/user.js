const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');
const User = require('../models/user');
const {
  HTTP_STATUS_GOOD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CREATE_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_CONFLICT_REQUEST,
  HTTP_STATUS_UNAUTHORIZED_REQUEST,
  HTTP_STATUS_WRONG_DATA,
} = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized-error');
const { JWT_SECRET } = require('../config');
const ServerError = require('../errors/server-error');

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(HTTP_STATUS_GOOD_REQUEST.status).send(user);
    })
    .catch(next);
};

const opt = { new: true, runValidators: true };

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, {
    name,
    email,
  }, opt)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_STATUS_NOT_FOUND.message);
      } else {
        res.status(HTTP_STATUS_GOOD_REQUEST.status).send(user);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(new UnauthorizedError(HTTP_STATUS_UNAUTHORIZED_REQUEST.message))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            res.cookie('jwt', token, {
              maxAge: 3000000,
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            }).send({
              data: user.toJSON(),
            });
          } else {
            throw new UnauthorizedError(HTTP_STATUS_WRONG_DATA.message);
          }
        })
        .catch(next);
    })
    .catch(next);
};

const createUsers = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(HTTP_STATUS_CREATE_REQUEST.status).send({ data: user.toJSON() });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(HTTP_STATUS_CONFLICT_REQUEST.message));
          } else {
            next(new ServerError(HTTP_STATUS_SERVER_ERROR.message));
          }
        });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.status(202).clearCookie('jwt').send({ message: 'cookie-cleared' });
};

module.exports = {
  getUserInfo,
  updateProfile,
  createUsers,
  login,
  logout,
};
