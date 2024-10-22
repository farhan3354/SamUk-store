// // models/User.js
// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: "user" }, // 'admin' or 'user'
// });

// module.exports = mongoose.model("User", UserSchema);
// // 

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Add email field
  role: { type: String, default: "user" }, // 'admin' or 'user'
});

module.exports = mongoose.model("User", UserSchema);
