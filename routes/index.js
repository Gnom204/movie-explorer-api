const router = require('express').Router();
const { createUsers, login, logout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { userDataValidator, emailPasswordValidator } = require('../utils/validation');
const movieRouter = require('./movie');
const userRouter = require('./user');

router.post('/signin', emailPasswordValidator, login);
router.post('/signup', userDataValidator, createUsers);
router.post('/signout', logout);

router.use(auth);

router.use('/users', userRouter);
router.use('/movie', movieRouter);

module.exports = router;
