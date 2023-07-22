const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { movieInfoValidator } = require('../utils/validation');

movieRouter.get('/', movieInfoValidator, getMovies);
movieRouter.post('/', movieInfoValidator, createMovie);
movieRouter.delete('/:movieId', deleteMovie);

module.exports = movieRouter;
