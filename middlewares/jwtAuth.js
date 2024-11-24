const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Middleware to authenticate a JWT token.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @description Verifies the JWT token provided in the Authorization header. 
 * If valid, attaches the decoded user information to the request object and calls next().
 * If invalid or absent, responds with an appropriate error message and status code.
 */
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

/**
 * Middleware to authorize a user with the given roles.
 * @param {string[]} roles - An array of roles.
 * @returns {Function} A middleware function that checks if the user has any of the given roles.
 * If the user does not have any of the roles, it responds with a 403 Forbidden status code and an appropriate error message.
 */
exports.authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
