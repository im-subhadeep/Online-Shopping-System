const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Review = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // 1. Check if User Purchased Product
    // We use a helper method in the Review model to check the orders table
    const [purchaseCheck] = await Review.verifyPurchase(userId, productId);

    if (purchaseCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // 2. Check if Review Exists
    const [existingReview] = await Review.checkExisting(userId, productId);

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // 3. Add New Review
    await Review.addReview({
      productId,
      userId,
      reviewMessage, // Mapped to 'comment' in SQL
      reviewValue,   // Mapped to 'rating' in SQL
    });

    // 4. Calculate New Average using SQL Aggregation
    const [avgResult] = await Review.getAverageRating(productId);
    const averageReview = avgResult[0].avgRating || 0;

    // 5. Update Product Table
    await Review.updateProductAverage(productId, averageReview);

    res.status(201).json({
      success: true,
      data: {
        productId,
        userId,
        reviewMessage,
        reviewValue
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews] = await Review.findAllByProduct(productId);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };