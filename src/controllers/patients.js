const { Patient } = require('../models');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const findOwned = async (id, userId) => {
  const patient = await Patient.findOne({ where: { id, createdBy: userId } });
  if (!patient) throw new ApiError(404, 'Patient not found');
  return patient;
};

exports.create = asyncHandler(async (req, res) => {
  const patient = await Patient.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: patient });
});

exports.list = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({ where: { createdBy: req.user.id }, order: [['id', 'ASC']] });
  res.json({ success: true, count: patients.length, data: patients });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await findOwned(req.params.id, req.user.id) });
});

exports.update = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.update(req.body);
  res.json({ success: true, data: patient });
});

exports.remove = asyncHandler(async (req, res) => {
  const patient = await findOwned(req.params.id, req.user.id);
  await patient.destroy();
  res.json({ success: true, message: 'Patient deleted' });
});
