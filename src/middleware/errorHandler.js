class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (req, res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  let details = err.details;

  switch (err.name) {
    case 'SequelizeUniqueConstraintError':
      status = 409;
      message = 'Resource already exists';
      details = err.errors.map((e) => ({ field: e.path, message: `${e.path} must be unique` }));
      break;
    case 'SequelizeValidationError':
      status = 400;
      message = 'Validation failed';
      details = err.errors.map((e) => ({ field: e.path, message: e.message }));
      break;
    case 'SequelizeForeignKeyConstraintError':
      status = 400;
      message = 'Referenced resource does not exist';
      break;
    case 'JsonWebTokenError':
    case 'TokenExpiredError':
      status = 401;
      message = 'Invalid or expired token';
      break;
    default:
  }

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Malformed JSON body';
  }

  if (status === 500) {
    console.error(err);
    message = 'Internal server error';
  }

  res.status(status).json({ success: false, message, ...(details && { details }) });
};

module.exports = { ApiError, asyncHandler, notFound, errorHandler };
