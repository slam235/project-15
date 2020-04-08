const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!avatar || !name || !about || !email || !password) {
    res.status(400).send({ message: 'Имя, описание и ссылка на аватар, email, пароль должны быть заполнены!' }); return;
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Successfuly logged' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске пользователей' }));
};

module.exports.getSingleUser = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Некорректный Id пользователя' });
  } else {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'Пользователь не найден' }); return;
        }
        if ((user._id).toString() !== req.params.id) return;
        res.status(200).send({ data: user });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (!req.user._id) {
    res.status(403).send({ message: 'Пользователь, выполняющий запрос, не авторизован!' });
  } else {
    User.findByIdAndUpdate(req.user._id, { name, about },
      { new: true, runValidators: true, upsert: true })
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка при обновлении профиля - ${err}` }));
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!req.user._id) {
    res.status(403).send({ message: 'Пользователь, выполняющий запрос, не авторизован!' });
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar },
      { new: true, runValidators: true, upsert: true })
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка при обновлении профиля - ${err}` }));
  }
};
