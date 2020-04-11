const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return Promise.reject(new Error('Такой карты нет'));
      if ((card.owner).toString() !== req.user._id) return Promise.reject(new Error('Карта не ваша! Удалить нельзя!'));
      return Card.remove(card)
        .then((cardToDelete) => res.send(cardToDelete !== null ? { data: card } : { data: 'Нечего удалять' }))
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'card to like is not found' }); return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'card to dislike is not found' }); return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
