const {
  NODE_ENV,
  PORT = 3000,
} = process.env;

const JWT_SECRET = NODE_ENV === 'production' ? process.env.JWT_SECRET : 'my-mega-secret-key';

module.exports = {
  JWT_SECRET,
  PORT,
};
