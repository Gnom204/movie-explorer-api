const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-err');
const Movie = require('../models/movie');
const {
  HTTP_STATUS_CREATE_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_GOOD_REQUEST,
  HTTP_STATUS_FORBIDDEN_REQUEST,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({
    owner: req.user._id,
  })
    .then((movies) => {
      res.status(HTTP_STATUS_CREATE_REQUEST.status).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(HTTP_STATUS_CREATE_REQUEST.status).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST.status)
          .send({ message: HTTP_STATUS_BAD_REQUEST.message });
      } else {
        res.status(HTTP_STATUS_SERVER_ERROR.status)
          .send({ message: HTTP_STATUS_SERVER_ERROR.message });
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(HTTP_STATUS_NOT_FOUND.message);
      } else if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(HTTP_STATUS_FORBIDDEN_REQUEST.message);
      } else {
        return Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.status(HTTP_STATUS_GOOD_REQUEST.status)
              .send({ message: HTTP_STATUS_GOOD_REQUEST.message });
          });
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
