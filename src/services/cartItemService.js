const User = require('../models/userModel.js'); // Import User model
const Cart = require('../models/cartModel.js');
const CartItem = require('../models/cartItemModel.js');
const Product = require('../models/productModel.js'); // Import Product model

const addCartItem = async (userId, { productId, quantity, size }) => {
  try {

    console.log("User ID:", userId);
    // Check if the user already has a cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = await Cart.create({
        user: userId, // Ensure userId is passed correctly
        cartItems: [],
        totalPrice: 0,
        totalItem: 0,
        totalDiscountedPrice: 0,
        discount: 0,
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if the product is already in the cart
    let cartItem = await CartItem.findOne({ cart: cart._id, product: productId, size });
    if (cartItem) {
      // If the product already exists in the cart, update the quantity and price
      cartItem.quantity += quantity || 1;
      cartItem.price = product.price * cartItem.quantity;
      cartItem.discountedPrice = product.discountedPrice * cartItem.quantity;
      await cartItem.save();
    } else {
      // If the product is not in the cart, create a new cart item
      cartItem = await CartItem.create({
        cart: cart._id,
        product: productId,
        quantity: quantity || 1,
        size,
        userId,
        price: product.price,
        discountedPrice: product.discountedPrice,
      });

      // Add the new cart item to the cart
      cart.cartItems.push(cartItem._id);
    }

    // Update the cart totals
    const cartItems = await CartItem.find({ cart: cart._id });
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    cartItems.forEach((item) => {
      totalPrice += item.price;
      totalDiscountedPrice += item.discountedPrice;
      totalItem += item.quantity;
    });

    cart.totalPrice = totalPrice;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.totalItem = totalItem;
    cart.discount = totalPrice - totalDiscountedPrice;

    await cart.save();

    return cartItem;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
    console.log("User ID in Service:", userId); // Debugging: Log the userId
    console.log("Cart Item ID in Service:", cartItemId); // Debugging: Log the cartItemId

    const item = await findCartItemById(cartItemId);
    if (!item) {
      throw new Error(`Cart item not found with id: ${cartItemId}`);
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }

    // Check if the user is authorized to update the cart item
    if (user._id.toString() !== userId.toString()) {
      throw new Error("You cannot update this item");
    }

    // Validate the data
    if (!cartItemData.quantity || isNaN(cartItemData.quantity)) {
      throw new Error("Invalid quantity");
    }
    if (!cartItemData.price || isNaN(cartItemData.price)) {
      throw new Error("Invalid price");
    }
    if (!cartItemData.discountedPrice || isNaN(cartItemData.discountedPrice)) {
      throw new Error("Invalid discountedPrice");
    }

    // Update the cart item
    item.quantity = cartItemData.quantity;
    item.price = item.quantity * cartItemData.price;
    item.discountedPrice = item.quantity * cartItemData.discountedPrice;
    const updatedCartItem = await item.save();

    // Update the cart totals
    const cart = await Cart.findById(item.cart);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const remainingCartItems = await CartItem.find({ cart: cart._id });

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    remainingCartItems.forEach((cartItem) => {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    });

    cart.totalPrice = totalPrice;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.totalItem = totalItem;
    cart.discount = totalPrice - totalDiscountedPrice;

    await cart.save();

    return updatedCartItem;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function removeCartItem(userId, cartItemId) {
  try {
    console.log("Cart Item ID:", cartItemId);
    console.log("User ID:", userId);

    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Check if the cart item belongs to the user
    if (cartItem.userId.toString() !== userId.toString()) {
      throw new Error("You are not authorized to delete this cart item");
    }

    // Delete the cart item
    await CartItem.findByIdAndDelete(cartItemId);

    // Update the cart totals
    const cart = await Cart.findById(cartItem.cart);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const remainingCartItems = await CartItem.find({ cart: cart._id });

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    remainingCartItems.forEach((item) => {
      totalPrice += item.price;
      totalDiscountedPrice += item.discountedPrice;
      totalItem += item.quantity;
    });

    cart.totalPrice = totalPrice;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.totalItem = totalItem;
    cart.discount = totalPrice - totalDiscountedPrice;

    await cart.save();

    return { message: "Cart item removed successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findCartItemById(cartItemId) {
  try {
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item not found with id: ${cartItemId}`);
    }
    return cartItem;
  } catch (error) {
    throw new Error(error.message);
  }
}



module.exports = {
  addCartItem,
  updateCartItem,
  removeCartItem,
  findCartItemById,
};