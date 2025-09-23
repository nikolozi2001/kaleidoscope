const logger = require('../config/logger');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error safely
  try {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  } catch (logError) {
    console.error('Logging error:', logError);
    console.error('Original error:', err.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // SQL Server errors
  if (err.code && err.code.startsWith('E')) {
    switch (err.code) {
      case 'ELOGIN':
        error = { message: 'Database authentication failed', statusCode: 500 };
        break;
      case 'ETIMEOUT':
        error = { message: 'Database connection timeout', statusCode: 500 };
        break;
      case 'EREQUEST':
        error = { message: 'Database request error', statusCode: 500 };
        break;
      default:
        error = { message: 'Database error occurred', statusCode: 500 };
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  try {
    logger.error(`Unhandled Promise Rejection: ${err.message}`);
  } catch (logError) {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
  }
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  try {
    logger.error(`Uncaught Exception: ${err.message}`);
  } catch (logError) {
    console.error(`Uncaught Exception: ${err.message}`);
  }
  process.exit(1);
});

module.exports = errorHandler;