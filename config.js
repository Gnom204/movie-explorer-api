require('dotenv').config();

const {
  NODE_ENV,
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/diplomdb',
} = process.env;

const JWT_SECRET = NODE_ENV === 'production' ? process.env.JWT_SECRET : 'my-mega-secret-key';

module.exports = {
  JWT_SECRET,
  PORT,
  MONGO_URL,
};
