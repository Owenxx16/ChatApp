const jwt = require('jsonwebtoken');
const generateToken = (userId, res ) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== 'development',
    // secure: true, // Set to true in production
    sameSite: 'strict',// Helps prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

module.exports = {
  generateToken
}