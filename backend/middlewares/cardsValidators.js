const { celebrate, Joi } = require('celebrate');

const createCardReqValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
      .required(),
  }),
});

const deleteCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
});

const likeCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
});

const dislikeCardReqValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
});

module.exports = {
  createCardReqValidator,
  deleteCardReqValidator,
  likeCardReqValidator,
  dislikeCardReqValidator,
};
