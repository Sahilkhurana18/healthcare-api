const { ApiError } = require('./errorHandler');

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.body = value;
  next();
};

const validateIntParam = (name) => (req, res, next) => {
  const v = Number(req.params[name]);
  if (!Number.isInteger(v) || v < 1) return next(new ApiError(400, `Invalid ${name}`));
  req.params[name] = v;
  next();
};

module.exports = { validateBody, validateIntParam };
