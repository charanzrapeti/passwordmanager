const NotFound = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const ErrorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode;
  res.status(400).send({
    message: error.message,
    name: error.name,
    stack: error.stack,
  });
  // res.status(statusCode);
  // res.json({
  //   message: error.message,
  //   name: error.name,
  //   stack: process.env.NODE_ENV !== "development" ? "Error" : error.stack,
  // });
};

module.exports = {
  NotFound,
  ErrorHandler,
};
