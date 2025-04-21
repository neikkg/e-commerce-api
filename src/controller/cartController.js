const cartService = require('../services/cartService.js'); // Import cartService
const cartItemService = require('../services/cartItemService.js'); // Add this line

const findUserCart = async (req, res) => {
    const user = req.user; // Extract user from the authenticated request
    try {
        const cart = await cartService.findUserCart(user._id); // Call the service to find the user's cart
        return res.status(200).send(cart); // Return the cart if found
    } catch (error) {
        return res.status(500).send({ error: error.message }); // Handle errors
    }
};

const addItemToCart = async (req, res) => {
    const user = req.user; // Extract user from the authenticated request
    try {
      const cartItem = await cartItemService.addCartItem(user._id, req.body); // Pass user._id to the service
      return res.status(200).send({ message: "Item added to cart successfully", cartItem });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };

const deleteAllCartItems = async (req, res) => {
  const userId = req.user._id; // Extract user ID from the authenticated request
  try {
    const result = await cartService.deleteAllCartItemsByUserId(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteAllCartItems:", error.message);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    findUserCart,
    addItemToCart,
    deleteAllCartItems
};