const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/authMiddleware");
const { registerSchema, loginSchema } = require("../validation/authSchemas");
const validateRequest = require("../middleware/validateRequest");
const rateLimit = require("express-rate-limit");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Improved rate limiting with better options
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

// Register route with validation
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  const { username, password, role, adminCode } = req.body;

  try {
    // Check if user exists with better error message
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ 
        message: "Username is already taken. Please choose another." 
      });
    }

    // Admin validation with specific error message
    if (role === "admin") {
      if (!adminCode || adminCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ 
          message: "Invalid admin registration code" 
        });
      }
    }

    // Create user with sanitized input
    const user = await User.create({ 
      username: username.toLowerCase().trim(),
      password,
      role
    });

    // Return success with user data
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    // console.log('Registration error details:', err); // Enhanced logging
    res.status(500).json({ 
      message: "Failed to register user. Please try again.",
      // error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login route with rate limiting and validation
router.post("/login", loginLimiter, validateRequest(loginSchema), async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user and check password
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ 
        message: "Invalid username or password" 
      });
    }
  } catch (err) {
    // console.error('Login error:', err);
    res.status(500).json({ 
      message: "Login failed. Please try again." 
    });
  }
});

// Get users with pagination
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ 
      message: "Failed to fetch users" 
    });
  }
});

// Delete user with improved error handling
// Replace the existing delete route with this:
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: "You cannot delete your own account" 
      });
    }

    // Use findByIdAndDelete instead of remove()
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    res.json({ 
      message: "User deleted successfully",
      deletedUser: {
        _id: deletedUser._id,
        username: deletedUser.username
      }
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ 
      message: "Failed to delete user",
      error: err.message 
    });
  }
});

// Promote user with additional checks
router.put("/promote/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ 
        message: "User is already an admin" 
      });
    }

    user.role = "admin";
    await user.save();

    res.json({ 
      message: `${user.username} has been promoted to admin`,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Promote user error:', err);
    res.status(500).json({ 
      message: "Failed to promote user" 
    });
  }
});

module.exports = router;