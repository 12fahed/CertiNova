// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const safeErrorCode =
    typeof err.errorCode === 'string'
      ? err.errorCode
      : typeof err.code === 'string' && err.code.startsWith('PROXY_')
        ? err.code
        : undefined;

  res.status(err.status || 500).json({
    success: false,
    ...(safeErrorCode && { code: safeErrorCode }),
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
