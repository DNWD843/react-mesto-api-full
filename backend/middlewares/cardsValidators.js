const { celebrate, Joi } = require('celebrate');

const getCardsReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(/^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required(),
    })
    .unknown(true),
});

const createCardReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(/^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required(),
    })
    .unknown(true),
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
        .required(),
    })
    .unknown(true),
});

const deleteCardReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(/^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required(),
    })
    .unknown(true),
  params: Joi.object()
    .keys({
      cardId: Joi.string().alphanum().required(),
    })
    .unknown(true),
});

const likeCardReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(/^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required(),
    })
    .unknown(true),
  params: Joi.object()
    .keys({
      cardId: Joi.string().alphanum().required(),
    })
    .unknown(true),
});

const dislikeCardReqValidator = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string()
        .pattern(/^Bearer.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required(),
    })
    .unknown(true),
  params: Joi.object()
    .keys({
      cardId: Joi.string().alphanum().required(),
    })
    .unknown(true),
});

module.exports = {
  getCardsReqValidator,
  createCardReqValidator,
  deleteCardReqValidator,
  likeCardReqValidator,
  dislikeCardReqValidator,
};
