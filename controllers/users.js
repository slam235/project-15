const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!avatar || !name || !about) {
    res.status(400).send({ message: 'Имя, описание и ссылка на аватар должны быть заполнены!' });
  } else {
    User.create({ name, about, avatar })
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Internal Server Error - ${err}` }));
  }
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
        if (JSON.stringify(user._id) !== req.params.id) {
          res.status(404).send({ message: 'Нет пользователя с таким Id' });
        } else {
          res.status(200).send({ data: user });
        }
      })
      .catch((err) => res.status(500).send({ message: `Internal Server Error - ${err}` }));
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
