const Joi = require('joi');

const registerSchema = Joi.object({
 username: Joi.string().required().min(3).max(30),
  password: Joi.string().required().min(6).max(128)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\|,.<>\\/?]).{6,}$'))
    .message('Password must be at least 6 characters and contain both letters, numbers and special characters'),
  role: Joi.string().valid('admin', 'officer').default('officer'),
  adminCode: Joi.string().when('role', {
    is: 'admin',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };