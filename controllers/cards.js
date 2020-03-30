const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      if (!name || !link) {
        res.status(400).send({ message: 'Имя и ссылка должы быть заполнены!' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: `Internal Server Error - ${err}` }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске карточек' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!req.params.cardId) {
        res.status(400).send({ message: 'Некорректный Id' });
      } else if (!card) {
        res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при удалении карточки' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!req.params.cardId) {
        res.status(400).send({ message: 'Некорректный Id' });
      } else if (!card) {
        res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при лайке карточки' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!req.params.cardId) {
        res.status(400).send({ message: 'Некорректный Id' });
      } else if (!card) {
        res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при дизлайке карточки' }));
};
