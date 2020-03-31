const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    res.status(400).send({ message: 'Имя и ссылка должы быть заполнены!' });
  } else {
    Card.create({ name, link, owner })
      .then((card) => res.status(200).send({ data: card }))
      .catch((err) => res.status(500).send({ message: `Internal Server Error - ${err}` }));
  }
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске карточек' }));
};

module.exports.deleteCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (JSON.stringify(card._id) !== req.params.cardId) {
          res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка при лайке карточки' }));
  }
};

module.exports.likeCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (JSON.stringify(card._id) !== req.params.cardId) {
          res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка при лайке карточки' }));
  }
};

module.exports.dislikeCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (JSON.stringify(card._id) !== req.params.cardId) {
          res.status(404).send({ message: 'Не найдена какрточка с таким Id' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch(() => res.status(500).send({ message: 'Произошла ошибка при дизлайке карточки' }));
  }
};
