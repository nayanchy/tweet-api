import * as Joi from 'joi';

const envValidation = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('dev', 'local', 'test').default('dev'),
  JWT_TOKEN_SECRET: Joi.string().required(),
  JWT_TOKEN_EXPIRATION: Joi.number().required(),
  REFRESH_TOKEN_EXPIRATION: Joi.number().required(),
});

export default envValidation;
