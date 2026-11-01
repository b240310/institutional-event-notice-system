/**
 * Request logger middleware
 * Logs HTTP method, URL, status code, and response time
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const colorCode =
      statusCode >= 500
        ? '\x1b[31m' // Red
        : statusCode >= 400
        ? '\x1b[33m' // Yellow
        : statusCode >= 300
        ? '\x1b[36m' // Cyan
        : '\x1b[32m'; // Green

    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} ${colorCode}${statusCode}\x1b[0m - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;

