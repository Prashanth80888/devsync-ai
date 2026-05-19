// Operational error class for capturing distinct, controlled application exceptions
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks structural errors distinct from system crashes

    Error.captureStackTrace(this, this.constructor);
  }
}

// Higher-order functional wrapper utility to eliminate try/catch boilerplate clutter in controllers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Global Express central exception handling pipeline collector
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Production visibility vs development debug detail conditions
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production operational response delivery mapping
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Log critical system structural failures cleanly to the cloud orchestrator console
      console.error(' [CRITICAL ERROR EXCEPTION]:', err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Application Server Malfunction occurred.'
      });
    }
  }
};