class ApiError extends Error {
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  };
  
module.exports = { ApiError, errorHandler };
  