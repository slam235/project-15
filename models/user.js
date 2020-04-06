const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => v.match(/^https?:\/\/(w{3}\.)?[\w-/.]{1,}/),
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
