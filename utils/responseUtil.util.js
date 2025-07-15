exports.sendResponse = function (
  res,
  statusCode,
  successFlag,
  message,
  statusMessage,
  data
) {
  if (data === null) {
    data = {};
  }

  return res.status(statusCode).json({
    success: successFlag,
    message: message,
    statusMessage: statusMessage,
    data: data,
  });
};
