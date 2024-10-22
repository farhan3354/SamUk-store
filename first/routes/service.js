const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../middleware/auth");
const Service = require("../models/Service");
const multer = require("multer");
const path = require("path");


// Get all services (public access)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    
    const title = req.body.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize title
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${title}${ext}`); // Save file with title and extension
  },
});

const upload = multer({ storage });

// Use upload middleware in your route
router.post("/", auth, upload.single("image"), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied.");
  }

  const { title, description, price } = req.body; // Don't forget to get these from req.body

  try {
    const newService = new Service({
      title,
      description,
      price,
      image: req.file.path, // Save the image path
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Update an existing service (admin only)
// router.put("/:id", auth, upload.single("image"), async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Access denied.");
//   }

//   const { title, description, price } = req.body; // Exclude image here
//   const updateData = { title, description, price };

//   // Update the image if it was uploaded
//   if (req.file) {
//     updateData.image = req.file.path;
//   }

//   try {
//     const updatedService = await Service.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedService) {
//       return res.status(404).send("Service not found");
//     }

//     res.json(updatedService);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });



// Use upload middleware in your route
router.put("/:id", auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied.");
  }

  const { title, description, price } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        image: req.file ? req.file.path : undefined // Update image path only if a new file was uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).send("Service not found");
    }

    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send("Service not found");
    }
    res.json(service);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete a service (admin only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied.");
  }

  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).send("Service not found");
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;

// const router = require("express").Router();
// const auth = require("../middleware/auth");
// const Service = require("../models/Service");

// // Get all services (public access)
// router.get("/", async (req, res) => {
//     try {
//         const services = await Service.find({});
//         res.json(services);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// });

// // Add a new service (admin only)
// router.post("/", auth, async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).send("Access denied.");
//     }

//     const { title, description, price, image } = req.body; // Include image

//     try {
//         const newService = new Service({ title, description, price, image }); // Include image
//         await newService.save();
//         res.status(201).json(newService);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// });

// // Update an existing service (admin only)
// router.put("/:id", auth, async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).send("Access denied.");
//     }

//     const { title, description, price, image } = req.body; // Include image

//     try {
//         const updatedService = await Service.findByIdAndUpdate(
//             req.params.id,
//             { title, description, price, image }, // Include image
//             { new: true, runValidators: true }
//         );

//         if (!updatedService) {
//             return res.status(404).send("Service not found");
//         }

//         res.json(updatedService);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// });

// // Delete a service (admin only)
// router.delete("/:id", auth, async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).send("Access denied.");
//     }

//     try {
//         const deletedService = await Service.findByIdAndDelete(req.params.id);

//         if (!deletedService) {
//             return res.status(404).send("Service not found");
//         }

//         res.json({ message: "Service deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// });

// module.exports = router;

// const router = require("express").Router();
// const auth = require("../middleware/auth");
// const Service = require("../models/Service"); // Ensure you import the Service model

// // Get all services (public access)
// router.get("/", async (req, res) => {
//   try {
//     const services = await Service.find({});
//     res.json(services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Add a new service (admin only)
// router.post("/", auth, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Access denied.");
//   }

//   const { title, description, price } = req.body;

//   try {
//     const newService = new Service({ title, description, price });
//     await newService.save();
//     res.status(201).json(newService);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Update an existing service (admin only)
// router.put("/:id", auth, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Access denied.");
//   }

//   const { title, description, price } = req.body;

//   try {
//     const updatedService = await Service.findByIdAndUpdate(
//       req.params.id,
//       { title, description, price },
//       { new: true, runValidators: true }
//     );

//     if (!updatedService) {
//       return res.status(404).send("Service not found");
//     }

//     res.json(updatedService);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Delete a service (admin only)
// router.delete("/:id", auth, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Access denied.");
//   }

//   try {
//     const deletedService = await Service.findByIdAndDelete(req.params.id);

//     if (!deletedService) {
//       return res.status(404).send("Service not found");
//     }

//     res.json({ message: "Service deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;

// // routes/service.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth"); // Middleware to check authentication
// const Service = require("../models/Service"); // Service model

// // Get all services
// router.get("/", async (req, res) => {
//   try {
//     const services = await Service.find();
//     res.json(services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// // Add a new service (admin only)
// router.post("/", auth, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).send("Access denied.");
//   }

//   const { title, description, price } = req.body;

//   try {
//     const newService = new Service({ title, description, price });
//     await newService.save();
//     res.status(201).json(newService);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;

// // // routes/service.js
// // const router = require('express').Router();
// // const Service = require('../models/Service');

// // // Create a service
// // router.post('/', async (req, res) => {
// //     const service = new Service(req.body);
// //     await service.save();
// //     res.status(201).send(service);
// // });

// // // Get all services
// // router.get('/', async (req, res) => {
// //     const services = await Service.find();
// //     res.json(services);
// // });

// // // Get a single service by ID
// // router.get('/:id', async (req, res) => {
// //     const service = await Service.findById(req.params.id);
// //     if (!service) return res.status(404).send('Service not found');
// //     res.json(service);
// // });

// // // Delete a service
// // router.delete('/:id', async (req, res) => {
// //     await Service.findByIdAndDelete(req.params.id);
// //     res.status(204).send();
// // });

// // module.exports = router;

// // routes/service.js
// const router = require('express').Router();
// const Service = require('../models/Service');
// const auth = require('../middleware/auth');

// // Get all services
// router.get('/', async (req, res) => {
//     const services = await Service.find();
//     res.json(services);
// });

// // Add a new service (admin only)
// router.post('/', auth, async (req, res) => {
//     if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

//     const service = new Service(req.body);
//     await service.save();
//     res.status(201).json(service);
// });

// // Update an existing service (admin only)
// router.put('/:id', auth, async (req, res) => {
//     if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

//     const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!service) return res.status(404).send('Service not found.');
//     res.json(service);
// });

// // Delete a service (admin only)
// router.delete('/:id', auth, async (req, res) => {
//     if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

//     const service = await Service.findByIdAndDelete(req.params.id);
//     if (!service) return res.status(404).send('Service not found.');
//     res.json({ message: 'Service deleted successfully.' });
// });

// module.exports = router;
