// backend/middlewares/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log detailed stack trace in console for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { errorHandler };
