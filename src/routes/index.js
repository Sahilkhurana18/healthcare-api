const router = require('express').Router();
const auth = require('../middleware/auth');
const { validateBody, validateIntParam } = require('../middleware/validate');
const schemas = require('../validators/schemas');
const authCtrl = require('../controllers/auth');
const patientCtrl = require('../controllers/patients');
const doctorCtrl = require('../controllers/doctors');
const mappingCtrl = require('../controllers/mappings');

const id = validateIntParam('id');

// Auth (public)
router.post('/auth/register', validateBody(schemas.register), authCtrl.register);
router.post('/auth/login', validateBody(schemas.login), authCtrl.login);

// Everything below requires a valid JWT
router.use(auth);

// Patients
router.post('/patients', validateBody(schemas.patient), patientCtrl.create);
router.get('/patients', patientCtrl.list);
router.get('/patients/:id', id, patientCtrl.get);
router.put('/patients/:id', id, validateBody(schemas.patient), patientCtrl.update);
router.delete('/patients/:id', id, patientCtrl.remove);

// Doctors
router.post('/doctors', validateBody(schemas.doctor), doctorCtrl.create);
router.get('/doctors', doctorCtrl.list);
router.get('/doctors/:id', id, doctorCtrl.get);
router.put('/doctors/:id', id, validateBody(schemas.doctor), doctorCtrl.update);
router.delete('/doctors/:id', id, doctorCtrl.remove);

// Mappings
router.post('/mappings', validateBody(schemas.mapping), mappingCtrl.create);
router.get('/mappings', mappingCtrl.list);
router.get('/mappings/:patientId', validateIntParam('patientId'), mappingCtrl.getByPatient);
router.delete('/mappings/:id', id, mappingCtrl.remove);

module.exports = router;
