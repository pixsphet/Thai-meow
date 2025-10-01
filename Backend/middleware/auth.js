const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Check if token is not empty
    if (!token || token.trim() === '') {
      return res.status(401).json({ message: 'Empty token' });
    }
    
    // Check if token contains only valid JWT characters
    if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Check if token looks like a JWT (has 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    // console.log('Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    // console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors without logging in production
    if (error.name === 'JsonWebTokenError') {
      // Don't log JWT malformed errors in production
      if (process.env.NODE_ENV === 'development') {
        console.error('JWT Error:', error.message);
      }
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      if (process.env.NODE_ENV === 'development') {
        console.error('Token Expired:', error.message);
      }
      return res.status(401).json({ message: 'Token expired' });
    } else {
      // Only log other errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth middleware error:', error.message);
      }
      return res.status(401).json({ message: 'Token is not valid' });
    }
  }
};

module.exports = auth;
