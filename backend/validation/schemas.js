const Joi = require('joi');

const criminalSchema = Joi.object({
  name: Joi.string().required().trim(),
  crimeCode: Joi.string().required(),
  arrestDate: Joi.date(),
  convictDate: Joi.date(),
  address: Joi.string(),
  state: Joi.string(),
  lga: Joi.string(),
  gender: Joi.string().valid('male', 'female'),
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
  gender: Joi.string().valid('male', 'female'),
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
  gender: Joi.string().valid('male', 'female'),
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