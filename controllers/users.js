const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (!avatar || !name || !about) {
        res.status(400).send({ message: 'Имя, описание и ссылка на аватар должны быть заполнены!' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => res.status(500).send({ message: `Internal Server Error - ${err}` }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске пользователей' }));
};

module.exports.getSingleUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!req.params.id) {
        res.status(400).send({ message: 'Некорректный Id пользователя' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(() => res.status(404).send({ message: 'Нет пользователя с таким Id' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (!req.user._id) {
        res.status(403).send({ message: 'Не найден пользователь с таким Id' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка при обновлении профиля - ${err}` }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (!req.user._id) {
        res.status(403).send({ message: 'Не найден пользователь с таким Id' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => res.status(500).send({ message: `Произвошла ошибка при обновлении аватарки - ${err}` }));
};
