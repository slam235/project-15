require('dotenv').config();

const prod = process.env.NODE_ENV === 'production';
module.exports = {
  JWT_SECRET: prod ? process.env.JWT_SECRET : 'secret key',
  PORT: 3000 || process.env.PORT,
  MONGO_URI: 'mongodb://localhost:27017/mestodb',
};
