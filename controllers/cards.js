const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: ` Произошла ошибка при создании карточки - ${err}` }));
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при поиске карточек' }));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(404).send(card !== null ? { data: card } : { data: 'Карточка не найдена' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при удалении карточки' }));
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(404).send(card !== null ? { data: card } : { data: 'Карточка не найдена' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при лайке карточки' }));
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.status(404).send(card !== null ? { data: card } : { data: 'Карточка не найдена' }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при дизлайке карточки' }));
};
