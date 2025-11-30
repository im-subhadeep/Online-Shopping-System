const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false, // Fixed typo from original code ('succes')
        message: "Keyword is required and must be in string format",
      });
    }

    // Call static SQL method
    const [searchResults] = await Product.search(keyword);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };