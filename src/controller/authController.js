const userService = require('../services/userService.js');
const jwtProvider = require('../config/jwtProvider.js');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user._id);

        // await cartService.createCart(user);

        return res.status(200).send({jwt, massage: 'registerd successfully', status: true});
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const login = async (req, res) => {
    const { password, email } = req.body;

    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).send({message: 'user not found with', email});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({message: 'invalid password'});
        }

        const jwt = jwtProvider.generateToken(user._id);

        return res.status(200).send({jwt, message: 'login successfully'});
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const logout = async (req, res) => {
    try {
        // Invalidate the token on the client side (e.g., remove it from localStorage or cookies)
        // Optionally, you can implement a token blacklist on the server side if needed.

        return res.status(200).send({ message: 'Logged out successfully', status: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    logout // Export the logout function
};