const serverErrorHandler = (error, res) => {
  console.error("Error signing up:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: error.errors.map(err => err.message).join(', '), // Concatenating all error messages
        success: false,
        error_code: 400,
      });
    } else {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
        error_code: 500,
      });
    }
}

module.exports = { serverErrorHandler }