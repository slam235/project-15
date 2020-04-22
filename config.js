const dev = process.env.NODE_ENV === 'development';
module.exports = {
  JWT_SECRET: dev ? 'secret key' : process.env.JWT_SECRET,
  PORT: 3000 || process.env.PORT,
  MONGO_URI: 'mongodb://localhost:27017/mestodb',
};
