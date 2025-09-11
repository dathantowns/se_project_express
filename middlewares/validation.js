const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const itemValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    // owner and likes are set by backend, not user
  }),
});

const userValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The "name" field must be at least 2 characters',
      "string.max": 'The "name" field must be at most 30 characters',
    }),
    avatar: Joi.string().custom(validateURL, "custom URL validation").messages({
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    // _id is set by backend
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const idParamValidator = (paramName) =>
  celebrate({
    params: Joi.object().keys({
      [paramName]: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
          "string.empty": `The "${paramName}" param must be provided`,
          "string.hex": `The "${paramName}" param must be a valid hex string`,
          "string.length": `The "${paramName}" param must be 24 characters`,
        }),
    }),
  });

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports = {
  itemValidator,
  userValidator,
  loginValidator,
  validateURL,
  idParamValidator,
};
