const userRouter = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/user');
const { userNameEmailValidator } = require('../utils/validation');

userRouter.get('/me', userNameEmailValidator, getUserInfo);
userRouter.patch('/me', userNameEmailValidator, updateProfile);

module.exports = userRouter;
