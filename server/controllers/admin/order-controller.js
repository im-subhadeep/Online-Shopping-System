const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    // MySQL returns an array: [rows, fields]. We destructure to get rows.
    const [orders] = await Order.findAll();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order by ID
    const [rows] = await Order.findById(id);
    const order = rows[0]; // Get the first result

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Check if order exists
    const [rows] = await Order.findById(id);
    const order = rows[0];

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Update the status (Maps 'orderStatus' from frontend to 'status' in DB)
    await Order.updateStatus(id, orderStatus);

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};