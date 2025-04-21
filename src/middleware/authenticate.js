const jwtProvider = require('../config/jwtProvider.js');
const User = require('../models/userModel.js'); // Import the User model

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Token not found' });
    }

    // Decode the token to get the user ID
    const userId = jwtProvider.getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).send({ error: 'Invalid token' });
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authenticate middleware:", error.message); // Debugging: Log the error
    return res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;