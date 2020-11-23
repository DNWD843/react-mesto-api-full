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
});

const editProfileReqValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const editAvatarReqValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
      .required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const loginReqValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required().min(8),
  }),
});

const getUserDataReqValidator = celebrate({
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

module.exports = {
  createUserReqValidator,
  editAvatarReqValidator,
  editProfileReqValidator,
  loginReqValidator,
  getUserDataReqValidator,
};
