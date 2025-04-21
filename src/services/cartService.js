const Cart = require("../models/cartModel.js");
const CartItem = require("../models/cartItemModel.js");
const Product = require("../models/productModel.js");

async function createCart(userId) {
  try {
    const cart = new Cart({ user: userId, cartItems: [] });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

const findUserCart = async (userId) => {
    try {
      const cart = await Cart.findOne({ user: userId }).populate({
        path: 'cartItems',
        populate: {
          path: 'product',
          select: 'title price discountedPrice',
          match: { isActive: true }, // Only populate active products
        },
      });
  
      if (!cart) {
        throw new Error("Cart not found for this user");
      }
  
      // Filter out cart items with missing products
      cart.cartItems = cart.cartItems.filter((item) => item.product);
  
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  };

async function addCartItem(userId, req) {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await createCart(userId); // Call createCart with userId
    }

    const product = await Product.findById(req.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const isPresent = await CartItem.findOne({
      product: req.productId,
      cart: cart._id,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: req.quantity || 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return "Item added to cart successfully";
    } else {
      throw new Error("Item already exists in the cart");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


const deleteAllCartItemsByUserId = async (userId) => {
  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error("Cart not found for this user");
    }

    // Delete all cart items associated with the cart
    await CartItem.deleteMany({ cart: cart._id });

    // Optionally, clear the cart totals
    cart.cartItems = [];
    cart.totalPrice = 0;
    cart.totalDiscountedPrice = 0;
    cart.totalItem = 0;
    cart.discount = 0;

    await cart.save();

    return { message: "All cart items deleted successfully for the user" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCart,
  findUserCart,
  addCartItem,
  deleteAllCartItemsByUserId,
};