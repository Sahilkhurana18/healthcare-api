const { Doctor } = require('../models');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

const findDoctor = async (id) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

// Doctors are readable by any authenticated user; only the creator can modify/delete.
const findOwned = async (id, userId) => {
  const doctor = await findDoctor(id);
  if (doctor.createdBy !== userId) throw new ApiError(403, 'You can only modify doctors you created');
  return doctor;
};

exports.create = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, data: doctor });
});

exports.list = asyncHandler(async (req, res) => {
  const doctors = await Doctor.findAll({ order: [['id', 'ASC']] });
  res.json({ success: true, count: doctors.length, data: doctors });
});

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await findDoctor(req.params.id) });
});

exports.update = asyncHandler(async (req, res) => {
  const doctor = await findOwned(req.params.id, req.user.id);
  await doctor.update(req.body);
  res.json({ success: true, data: doctor });
});

exports.remove = asyncHandler(async (req, res) => {
  const doctor = await findOwned(req.params.id, req.user.id);
  await doctor.destroy();
  res.json({ success: true, message: 'Doctor deleted' });
});
