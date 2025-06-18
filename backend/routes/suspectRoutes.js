const express = require("express");
const router = express.Router();
const Suspect = require("../models/Suspect");
const { protect, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { suspectSchema } = require('../validation/schemas');
const validateRequest = require('../middleware/validateRequest');

// CREATE with file upload
router.post(
  "/",
  protect,
  authorize("admin", "officer"),
  validateRequest(suspectSchema),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "thumbprint", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { body, files, user } = req;

      const suspect = new Suspect({
        ...body,
        photo: files.photo
          ? { data: files.photo[0].buffer, contentType: files.photo[0].mimetype }
          : undefined,
        thumbprint: files.thumbprint
          ? { data: files.thumbprint[0].buffer, contentType: files.thumbprint[0].mimetype }
          : undefined,
        createdBy: user.username,
        updatedBy: user.username,
      });

      await suspect.save();
      res.status(201).json(suspect);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Serve photo
router.get("/photo/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const suspect = await Suspect.findById(req.params.id);
    if (suspect?.photo?.data) {
      res.set("Content-Type", suspect.photo.contentType);
      return res.send(suspect.photo.data);
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

// GET all suspects
router.get("/", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const suspects = await Suspect.find();
    res.json(suspects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE suspect
router.put("/:id", protect, authorize("admin", "officer"), async (req, res) => {
  try {
    const suspect = await Suspect.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.username,
      },
      { new: true }
    );
    res.json(suspect);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE suspect
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await Suspect.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;