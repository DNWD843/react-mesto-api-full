const SALT_ROUND = 10;
const JWT_SECRET = 'most-powerful-scret';
const JWT_MAX_AGE = 3600000 * 24 * 7;

module.exports = {
  SALT_ROUND,
  JWT_SECRET,
  JWT_MAX_AGE,
};
