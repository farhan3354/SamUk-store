// models/Cart.js
const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
//   quantity: { type: Number, default: 1 }, // Optionally, you can track quantity
// }, { timestamps: true });

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartItemSchema);

module.exports = Cart;
