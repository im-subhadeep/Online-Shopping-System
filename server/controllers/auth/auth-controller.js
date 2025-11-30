const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // 1. Check if user exists (MySQL returns [rows, fields])
    const [existingUsers] = await User.findByEmail(email);

    if (existingUsers.length > 0) {
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
    }

    // 2. Hash Password
    const hashPassword = await bcrypt.hash(password, 12);

    // 3. Create User
    await User.createUser({
      username: userName,
      email,
      password: hashPassword
    });

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find User
    const [rows] = await User.findByEmail(email);
    const checkUser = rows[0]; // Get the first user found

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });
    }

    // 2. Check Password (compare against 'password_hash' column)
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password_hash
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // 3. Generate Token (Use 'user_id' instead of '_id')
    const token = jwt.sign(
      {
        id: checkUser.user_id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.username,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.user_id,
        userName: checkUser.username,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Logout (No database changes needed)
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Auth Middleware (No database changes needed)
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };