const { celebrate, Joi } = require('celebrate');

const createUserReqValidator = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /[-a-zA-Z0-9@:%_.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&/=]*)?/i,
      ),
      email: Joi.string().email().required(),
      password: Joi.string().alphanum().required().min(8),
    })
    .unknown(true),
});

const editProfileReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(
          /^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        .required(),
    })
    .unknown(true),
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    })
    .unknown(true),
});

const editAvatarReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(
          /^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        .required(),
    })
    .unknown(true),
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .pattern(
          /[-a-zA-Z0-9@:%_.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&/=]*)?/i,
        )
        .required(),
    })
    .unknown(true),
});

const loginReqValidator = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().alphanum().required().min(8),
    })
    .unknown(true),
});

const getUserDataReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(
          /^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        )
        .required(),
    })
    .unknown(true),
});

module.exports = {
  createUserReqValidator,
  editAvatarReqValidator,
  editProfileReqValidator,
  loginReqValidator,
  getUserDataReqValidator,
};
