const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json({ message: 'Unauthorizedaa' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
      return res.status(401).json({ message: 'Unauthorizedbbb' });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if(!user) {
      return res.status(404).json({ message: 'Unauthorizedccc' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectedRoute middleware', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = {
  protectRoute
}