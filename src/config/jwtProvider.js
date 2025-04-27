require('dotenv').config();  // Ensure dotenv is loaded


if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;  // Using the JWT_SECRET from environment variables

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1d' });
  return token;
};

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, getUserIdFromToken };