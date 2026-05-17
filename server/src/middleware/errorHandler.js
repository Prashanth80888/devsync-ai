/**
 * Global centralized Error Interceptor middleware layer.
 * Catches all execution anomalies thrown throughout the API pipeline and outputs
 * highly deterministic, clean JSON payload structures back to the requesting client client.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Infrastructure Error',
    // Prevent environment stack traces leakage to public clients while in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  // Log complete tracking trace on local console for engineering review
  console.error(`[API ERROR ENCOUNTERED]: ${err.message}`);
  
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;