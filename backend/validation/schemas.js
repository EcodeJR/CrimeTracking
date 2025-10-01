const Joi = require('joi');

const genderValidator = (value, helpers) => {
  if (!value) return value;
  const normalized = value.toLowerCase();
  if (normalized === 'male') return 'male';
  if (normalized === 'female') return 'female';
  // Handle common misspelling
  if (normalized === 'femle') return 'female';
  return helpers.error('any.only', { valids: ['male', 'female'] });
};

const criminalSchema = Joi.object({
  name: Joi.string().required().trim(),
  crimeCode: Joi.string().required(),
  arrestDate: Joi.date(),
  convictDate: Joi.date(),
  address: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  gender: Joi.string().custom(genderValidator, 'case-insensitive gender validation'),
  age: Joi.number().min(0).max(150),
  complexion: Joi.string(),
  height: Joi.number().min(0),
  weight: Joi.number().min(0),
  remarks: Joi.string(),
  officerInCharge: Joi.string().required()
});

const suspectSchema = Joi.object({
  name: Joi.string().required().trim(),
  crimeCode: Joi.string().required(),
  arrestDate: Joi.date(),
  address: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  gender: Joi.string().custom(genderValidator, 'case-insensitive gender validation'),
  age: Joi.number().min(0).max(150),
  complexion: Joi.string(),
  height: Joi.number().min(0),
  weight: Joi.number().min(0),
  remarks: Joi.string(),
  officerInCharge: Joi.string().required()
});

const complainantSchema = Joi.object({
  name: Joi.string().required().trim(),
  address: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  gender: Joi.string().custom(genderValidator, 'case-insensitive gender validation'),
  complexion: Joi.string(),
  eyeColor: Joi.string(),
  hairColor: Joi.string(),
  occupation: Joi.string(),
  phone: Joi.string().pattern(/^\d{11}$/), // Nigerian phone number format
  reportDate: Joi.date().required(),
  reportTime: Joi.string().required(),
  remarks: Joi.string(),
  officerInCharge: Joi.string().required()
});

module.exports = {
  criminalSchema,
  suspectSchema,
  complainantSchema
};