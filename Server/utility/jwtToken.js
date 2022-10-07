// Send token to cookie
exports.sendToken = (generated_token, statusCode, res) => {
  // Options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  console.log("hi");
  res.status(statusCode).cookie("token", generated_token, options).json({
    success: true,
    generated_token
  });
};
