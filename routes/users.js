const usersRouter = require('express').Router();
const { createUser, getUsers, getSingleUser, updateUser, updateAvatar } = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:id', getSingleUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
