// routes/user.js
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send("Username already taken");
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).send("Email already registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email, // Include email
      role: "user", // Default role
    });

    // Save the user to the database
    await user.save();

    // Generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    // Send the token in the response
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// User login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token });
});

// Get all users (admin only)
// // Get all users (admin only)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied.");
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    // Since auth middleware attaches the user to req.user, we can use it directly
    const user = await User.findById(req.user._id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json(user); // Send user details
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied.");
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
