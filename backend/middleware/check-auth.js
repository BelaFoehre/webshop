const jwt = require("jsonwebtoken");
const config = process.env;

/**
 * It checks if a token is present in the request, and if it is, it verifies it and attaches the
 * decoded token to the request object
 * @param req - The request object
 * @param res - The response object.
 * @param next - This is a function that is called when the middleware is complete.
 * @returns A function that takes in a request, response, and next.
 */
const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
