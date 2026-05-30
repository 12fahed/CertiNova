// Global error handling middleware
const isSafeProxyErrorCode = (code) => typeof code === 'string' && code.startsWith('PROXY_');

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const safeErrorCode =
    typeof err.errorCode === 'string'
      ? err.errorCode
      : isSafeProxyErrorCode(err.code)
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
