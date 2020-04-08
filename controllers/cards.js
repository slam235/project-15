const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    res.status(400).send({ message: 'Имя и ссылка должы быть заполнены!' });
  } else {
    Card.create({ name, link, owner })
      .then((card) => res.status(200).send({ data: card }))
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Карточка не найдена' });
        }
        if ((card.owner).toString() !== req.user._id) {
          return Promise.reject(new Error('Карта не ваша! Удалить нельзя!'));
        }
        if ((card._id).toString() !== req.params.cardId) return '';
        return res.status(200).send({ data: card });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

module.exports.likeCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'card to like is not found' }); return;
        }
        if ((card._id).toString() !== req.params.cardId) return;
        res.status(200).send({ data: card });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};

module.exports.dislikeCard = (req, res) => {
  if (!req.params.cardId) {
    res.status(400).send({ message: 'Некорректный Id' });
  } else {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'card to dislike is not found' }); return;
        }
        if ((card._id).toString() !== req.params.cardId) return;
        res.status(200).send({ data: card });
      })
      .catch((err) => res.status(500).send({ message: err.message }));
  }
};
