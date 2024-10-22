// // routes/cart.js
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const Cart = require("../models/Cart");

// const router = express.Router();

// // Middleware to verify token
// const authenticateToken = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   console.log("Token received:", token);
//   if (!token) return res.sendStatus(401); // No token

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.log("JWT Error:", err);
//       return res.sendStatus(403); // Forbidden
//     }
//     req.user = user; // Set user in request
//     console.log("Authenticated user:", req.user);
//     next();
//   });
// };

// // Add an item to the cart
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const cartItems = await Cart.find({ userId: req.user.id }); // Find cart items by user ID
//     res.status(200).json(cartItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Add an item to the cart
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const cartItem = new Cart({
//       ...req.body,
//       userId: req.user.id, // Associate the cart item with the authenticated user
//     });
//     await cartItem.save();
//     res.status(201).json({ message: "Item added to cart", cartItem });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.put("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body; // Assuming we want to update the quantity

//   try {
//     const updatedCartItem = await Cart.findOneAndUpdate(
//       { _id: id, userId: req.user.id }, // Ensure the item belongs to the user
//       { quantity },
//       { new: true } // Return the updated document
//     );

//     if (!updatedCartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     res.status(200).json({ message: "Cart item updated", updatedCartItem });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.delete("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedCartItem = await Cart.findOneAndDelete({ _id: id, userId: req.user.id }); // Ensure the item belongs to the user

//     if (!deletedCartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     res.status(200).json({ message: "Cart item deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart"); // Adjust the path as needed

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Token received:", token);
  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Error:", err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Set user in request
    console.log("Authenticated user:", req.user);
    next();
  });
};

// // Get all cart items for the authenticated user, including service details
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     const cartItems = await Cart.find({ userId: req.user.id })
//       .populate('serviceId', 'title description price image'); // Populate the service details
//     res.status(200).json(cartItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Get all items in the cart for a user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate(
      "serviceId"
    ); // Populate the serviceId field

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cart items with user and service details
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    // Fetch cart items and populate user and service details
    const cartItems = await Cart.find()
      .populate("userId", "username") // Adjust according to your user schema
      .populate("serviceId", "title price description"); // Adjust according to your service schema

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add an item to the cart
router.post("/", authenticateToken, async (req, res) => {
  try {
    const cartItem = new Cart({
      ...req.body,
      userId: req.user.id, // Associate the cart item with the authenticated user
    });
    await cartItem.save();
    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an item in the cart
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // Assuming we want to update the quantity

  try {
    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure the item belongs to the user
      { quantity },
      { new: true } // Return the updated document
    ).populate("serviceId", "title description price image"); // Populate updated item

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item updated", updatedCartItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an item from the cart
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCartItem = await Cart.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    }); // Ensure the item belongs to the user

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
