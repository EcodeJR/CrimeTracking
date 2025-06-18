const express = require("express");
const router = express.Router();
const Complainant = require("../models/Complainant");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { complainantSchema } = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');


// CREATE with file upload
router.post(
  "/",
  protect, 
  authorize("admin", "officer"),
  validateRequest(complainantSchema),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { body, file, user } = req;

      const complainant = new Complainant({
        ...body,
        photo: file
          ? { data: file.buffer, contentType: file.mimetype }
          : undefined,
        createdBy: user.username,
        updatedBy: user.username,
      });

      await complainant.save();
      res.status(201).json(complainant);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Serve photo
router.get("/photo/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const complainant = await Complainant.findById(req.params.id);
    if (complainant?.photo?.data) {
      res.set("Content-Type", complainant.photo.contentType);
      return res.send(complainant.photo.data);
    }
    res.status(404).send("No photo");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all complainants
router.get("/", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const complainants = await Complainant.find();
    res.json(complainants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE complainant
router.put("/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const complainant = await Complainant.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.username,
      },
      { new: true }
    );
    res.json(complainant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE complainant
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await Complainant.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;