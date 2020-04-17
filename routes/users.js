const usersRouter = require('express').Router();
const {
  getUsers, getSingleUser, updateUser, updateAvatar,
} = require('../controllers/users');


usersRouter.get('/', getUsers);
usersRouter.get('/:id', getSingleUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
