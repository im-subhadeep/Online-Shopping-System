const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const [product] = await Product.findById(productId);

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 1. Get or Create Cart ID for User
    const cartId = await Cart.createOrGetCartId(userId);

    // 2. Add Item (Handles "if exists update, else insert" logic internally)
    await Cart.addItem(cartId, productId, quantity);

    // 3. Fetch updated cart items to return
    const [items] = await Cart.getCartItems(userId);

    res.status(200).json({
      success: true,
      data: {
        _id: cartId, // Simulate cart ID
        userId,
        items: items, // Return the formatted items directly from SQL
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is manadatory!",
      });
    }

    // Fetch items with product details using JOIN
    const [items] = await Cart.getCartItems(userId);

    // We don't need to map complex objects here because SQL 
    // returned exactly what we asked for in the Model
    res.status(200).json({
      success: true,
      data: {
        userId,
        items: items,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Update Quantity
    await Cart.updateItemQty(userId, productId, quantity);

    // Fetch updated list
    const [items] = await Cart.getCartItems(userId);

    res.status(200).json({
      success: true,
      data: {
        userId,
        items: items,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Delete Item
    await Cart.deleteItem(userId, productId);

    // Fetch updated list
    const [items] = await Cart.getCartItems(userId);

    res.status(200).json({
      success: true,
      data: {
        userId,
        items: items,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};