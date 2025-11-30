const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    // REPLACED: new Product(req.body).save() 
    // WITH: Static SQL method
    const [result] = await Product.addProduct(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        ...req.body,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const [listOfProducts] = await Product.findAll();
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existing] = await Product.findById(id);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product
    await Product.editProduct(id, req.body);

    res.status(200).json({
      success: true,
      data: { id, ...req.body },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await Product.deleteById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};