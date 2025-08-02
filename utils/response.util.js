const sendSuccess = (
  res,
  statusCode = 200,
  data = null,
  message = 'Success'
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const sendError = (
  res,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  message = 'Something went wrong',
  details = null
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    }
  });
};

module.exports = {sendSuccess, sendError}
