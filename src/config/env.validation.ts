import * as Joi from 'joi';

const envValidation = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('dev', 'local', 'test').default('dev'),
});

export default envValidation;
