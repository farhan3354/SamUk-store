// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(403).send('Access denied.');

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).send('Invalid token.');
//         req.user = user;
//         next();
//     });
// };

// module.exports = auth;
// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const auth = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) return res.status(401).send("Access denied.");

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(verified.id);
//     next();
//   } catch (error) {
//     res.status(403).send("Invalid token");
//   }
// };

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied.");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);

    if (!user) return res.status(404).send("User not found."); // Check if user exists
    req.user = user; // Attach user to request

    next();
  } catch (error) {
    console.error("JWT verification error:", error); // Log the error for debugging
    res.status(403).send("Invalid token");
  }
};

module.exports = auth;
