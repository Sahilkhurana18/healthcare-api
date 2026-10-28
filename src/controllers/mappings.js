const { Mapping, Patient, Doctor } = require('../models');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

// Only mappings whose patient belongs to the current user are visible/modifiable.
const ownedPatientInclude = (userId) => ({
  model: Patient,
  as: 'patient',
  where: { createdBy: userId },
  required: true,
});

exports.create = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  const patient = await Patient.findOne({ where: { id: patientId, createdBy: req.user.id } });
  if (!patient) throw new ApiError(404, 'Patient not found');

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  const mapping = await Mapping.create({ patientId, doctorId }); // duplicate -> 409 via error handler
  res.status(201).json({ success: true, data: { ...mapping.toJSON(), patient, doctor } });
});

exports.list = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [ownedPatientInclude(req.user.id), { model: Doctor, as: 'doctor' }],
    order: [['id', 'ASC']],
  });
  res.json({ success: true, count: mappings.length, data: mappings });
});

exports.getByPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ where: { id: req.params.patientId, createdBy: req.user.id } });
  if (!patient) throw new ApiError(404, 'Patient not found');

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [{ model: Doctor, as: 'doctor' }],
  });
  res.json({
    success: true,
    patient: { id: patient.id, name: patient.name },
    count: mappings.length,
    data: mappings.map((m) => ({ mappingId: m.id, doctor: m.doctor })),
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const mapping = await Mapping.findOne({
    where: { id: req.params.id },
    include: [ownedPatientInclude(req.user.id)],
  });
  if (!mapping) throw new ApiError(404, 'Mapping not found');

  await mapping.destroy();
  res.json({ success: true, message: 'Doctor removed from patient' });
});
