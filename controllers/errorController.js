const AppError = require("../utils/appError");

//sending a readable error to he client
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDupErrorDB = err => {
    const message = `Cannot have duplicate keys for ${err.keyValue.name}`;
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. Errors: ${errors.join(". ")}`
    return new AppError(message, 400)
}


const handleJWTError = () => {
    return new AppError("Invalid token, please login again", 401)
}

const hadleJWTExpirationError = () => new AppError("Session Expired", 401)


const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //Operational Error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Errors from probably third party packages or errors we do not know the source
  } else {
    res.status(500).json({
      status: "error",
      message: "A fatal error occured",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
  
    let error = Object.assign({}, err);
      //castErrors happen if for example client sends a non-recognizable ID to mongoose to perform an action
    //   now we handle that in production
    if (err.name === "CastError") error = handleCastErrorDB(error);

    //Handling duplicate keys (Could be good for emails)
    if (err.code === 11000) error = handleDupErrorDB(error)

    if(err.name === "ValidationError") error = handleValidationErrorDB(error)

    if(err.name === "JsonWebTokenError") error = handleJWTError()

    if(err.name === "TokenExpiredError") error = hadleJWTExpirationError()

    sendErrorProd(error, res);
  }
};
