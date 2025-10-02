// --- server/routes/criminalRoutes.js ---
const { criminalSchema } = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');

const express = require("express");
const router = express.Router();
const Criminal = require("../models/Criminal");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CREATE with file upload
// Create
router.post(
  "/",
  protect,
  authorize("admin", "officer"),
  validateRequest(criminalSchema),
  upload.fields([{ name: "photo" }, { name: "thumbprint" }]),
  async (req, res) => {
    try {
      const { body, files, user } = req;

      const criminal = new Criminal({
        ...body,
        photo: files && files.photo
          ? { data: files.photo[0].buffer, contentType: files.photo[0].mimetype }
          : undefined,
        thumbprint: files && files.thumbprint
          ? { data: files.thumbprint[0].buffer, contentType: files.thumbprint[0].mimetype }
          : undefined,
        createdBy: user.username,
        updatedBy: user.username,
      });

      await criminal.save();
      res.status(201).json(criminal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update
router.put("/:id", 
  protect,
  authorize("admin", "officer"), 
  upload.fields([{ name: "photo" }, { name: "thumbprint" }]),
  async (req, res) => {
    try {
      const { body, files, user } = req;
      
      const updateData = {
        ...body,
        updatedBy: user.username,
      };

      // Add photo if uploaded
      if (files && files.photo) {
        updateData.photo = {
          data: files.photo[0].buffer,
          contentType: files.photo[0].mimetype
        };
      }

      // Add thumbprint if uploaded
      if (files && files.thumbprint) {
        updateData.thumbprint = {
          data: files.thumbprint[0].buffer,
          contentType: files.thumbprint[0].mimetype
        };
      }

      const criminal = await Criminal.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      res.json(criminal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await Criminal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 'admin' and 'officer' can view
router.get("/", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const criminals = await Criminal.find();
    res.json(criminals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 'admin' and 'officer' can view a specific criminal
router.get("/photo/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    if (criminal?.photo?.data) {
      res.set("Content-Type", criminal.photo.contentType);
      return res.send(criminal.photo.data);
    }
    res.status(404).send("No photo");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this to criminalRoutes.js and suspectRoutes.js
router.get("/thumbprint/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    if (criminal?.thumbprint?.data) {
      res.set("Content-Type", criminal.thumbprint.contentType);
      return res.send(criminal.thumbprint.data);
    }
    res.status(404).send("No thumbprint");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
