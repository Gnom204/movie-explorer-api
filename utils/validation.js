const { celebrate, Joi } = require('celebrate');
const { regexForImageUrl } = require('./constants');

const emailPasswordValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
});

const userDataValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),

      email: Joi.string()
        .email()
        .required(),

      password: Joi.string()
        .required(),
    }),
});

const userNameEmailValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),

      email: Joi.string()
        .email()
        .required(),
    }),
});

const movieInfoValidator = celebrate({
  body: Joi.object()
    .keys({
      country: Joi.string()
        .required(),

      director: Joi.string()
        .required(),

      duration: Joi.number()
        .required(),

      year: Joi.number()
        .required(),

      description: Joi.string()
        .required(),

      image: Joi.string()
        .pattern(regexForImageUrl)
        .required(),

      trailerLink: Joi.string()
        .required(),

      thumbnail: Joi.string()
        .pattern(regexForImageUrl)
        .required(),

      movieId: Joi.number()
        .required(),

      nameRU: Joi.string()
        .required(),

      nameEN: Joi.string()
        .required(),
    }),
});
module.exports = {
  emailPasswordValidator,
  userDataValidator,
  userNameEmailValidator,
  movieInfoValidator,
};
