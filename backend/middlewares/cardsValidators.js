const { celebrate, Joi } = require('celebrate');

const getCardsReqValidator = celebrate({
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const createCardReqValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
      .required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const deleteCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const likeCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

const dislikeCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
  cookies: Joi.object().keys({
    token: Joi.string()
      .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      .required(),
  }),
});

module.exports = {
  getCardsReqValidator,
  createCardReqValidator,
  deleteCardReqValidator,
  likeCardReqValidator,
  dislikeCardReqValidator,
};
