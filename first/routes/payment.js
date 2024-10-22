// // routes/payment.js
// const router = require('express').Router();
// const Stripe = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const Service = require('../models/Service');

// router.post('/', async (req, res) => {
//     const { serviceId } = req.body;
//     const service = await Service.findById(serviceId);
//     if (!service) return res.status(404).send('Service not found');

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [{
//             name: service.title,
//             amount: service.price * 100, // amount in cents
//             currency: 'usd',
//             quantity: 1,
//         }],
//         success_url: 'http://localhost:3000/success',
//         cancel_url: 'http://localhost:3000/cancel',
//     });

//     res.json({ id: session.id });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth"); // Import your auth middleware

router.post("/checkout", auth, async (req, res) => {
  const { items } = req.body; // This should be an array of cart items
  const totalAmount =
    items.reduce((total, item) => {
      const price = item.serviceId ? item.serviceId.price : 0;
      return total + price * item.quantity;
    }, 0) * 100; // Convert to cents

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.serviceId.title,
            description: item.serviceId.description,
          },
          unit_amount: item.serviceId.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment processing failed" });
  }
});

module.exports = router;
