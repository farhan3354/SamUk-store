// // models/Service.js
// const mongoose = require('mongoose');

// const ServiceSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
// });

// module.exports = mongoose.model('Service', ServiceSchema);

const mongoose = require("mongoose");

// const ServiceSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, required: true }, // New image field
// });

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // URL or path to the image
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
// module.exports = mongoose.model("Service", ServiceSchema);
