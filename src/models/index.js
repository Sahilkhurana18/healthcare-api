const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
});

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  medicalHistory: { type: DataTypes.TEXT },
});

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  specialization: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  experienceYears: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const Mapping = sequelize.define(
  'Mapping',
  {},
  { indexes: [{ unique: true, fields: ['patientId', 'doctorId'] }] }
);

// Ownership
User.hasMany(Patient, { foreignKey: { name: 'createdBy', allowNull: false }, onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Doctor, { foreignKey: { name: 'createdBy', allowNull: false }, onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdBy' });

// Mapping
Patient.hasMany(Mapping, { foreignKey: { name: 'patientId', allowNull: false }, onDelete: 'CASCADE' });
Doctor.hasMany(Mapping, { foreignKey: { name: 'doctorId', allowNull: false }, onDelete: 'CASCADE' });
Mapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };
