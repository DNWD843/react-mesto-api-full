const { celebrate, Joi } = require('celebrate');

const createUserReqValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i,
    ),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required().min(8),
  }),
  cookies: 'token',
});

const editProfileReqValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const editAvatarReqValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
      .required(),
  }),
  cookies: 'token',
});

const loginReqValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required().min(8),
  }),
});

module.exports = {
  createUserReqValidator,
  editAvatarReqValidator,
  editProfileReqValidator,
  loginReqValidator,
};
