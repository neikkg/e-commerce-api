const cartItemService = require('../services/cartItemService.js');

const addCartItem = async (req, res) => {
  const userId = req.user._id; // Extract user ID from the authenticated user
  try {
    const { productId, quantity, price, discountedPrice, size } = req.body;

    const cartItem = await cartItemService.addCartItem(userId, {
      productId,
      quantity,
      price,
      discountedPrice,
      size,
    });

    return res.status(200).send({ message: 'Item added to cart successfully', cartItem });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const user = req.user; // Extract user from the authenticated request
  const { Id: cartItemId } = req.params; // Extract cartItemId from the request parameters
  const cartItemData = req.body; // Extract the updated cart item data from the request body

  try {
    console.log("Cart Item ID in Controller:", cartItemId); // Debugging: Log the cartItemId
    console.log("User ID in Controller:", user._id); // Debugging: Log the userId

    // Validate the request body
    if (!cartItemData.quantity || isNaN(cartItemData.quantity)) {
      return res.status(400).send({ error: "Invalid quantity" });
    }
    if (!cartItemData.price || isNaN(cartItemData.price)) {
      return res.status(400).send({ error: "Invalid price" });
    }
    if (!cartItemData.discountedPrice || isNaN(cartItemData.discountedPrice)) {
      return res.status(400).send({ error: "Invalid discountedPrice" });
    }

    const updatedCartItem = await cartItemService.updateCartItem(user._id, cartItemId, cartItemData); // Pass user._id, cartItemId, and cartItemData to the service
    return res.status(200).send({ message: "Cart item updated successfully", updatedCartItem });
  } catch (error) {
    console.error("Error in updateCartItem:", error.message); // Debugging: Log the error
    return res.status(500).send({ error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  const user = req.user; // Extract user from the authenticated request
  const { cartItemId } = req.params; // Extract cartItemId from the request parameters
  try {
    console.log("Cart Item ID in Controller:", cartItemId); // Debugging: Log the cartItemId
    console.log("User ID in Controller:", user._id); // Debugging: Log the userId

    const result = await cartItemService.removeCartItem(user._id, cartItemId); // Pass user._id and cartItemId to the service
    return res.status(200).send(result);
  } catch (error) {
    console.error("Error in removeCartItem:", error.message); // Debugging: Log the error
    return res.status(500).send({ error: error.message });
  }
};



module.exports = {
  addCartItem,
  updateCartItem,
  removeCartItem,
}