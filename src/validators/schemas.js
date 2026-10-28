const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(72).required(),
});

const login = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
});

const patient = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  address: Joi.string().trim().min(3).required(),
  medicalHistory: Joi.string().allow('', null),
});

const doctor = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  specialization: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).required()
    .messages({ 'string.pattern.base': 'phone must be a valid phone number' }),
  experienceYears: Joi.number().integer().min(0).max(80).default(0),
});

const mapping = Joi.object({
  patientId: Joi.number().integer().min(1).required(),
  doctorId: Joi.number().integer().min(1).required(),
});

module.exports = { register, login, patient, doctor, mapping };
