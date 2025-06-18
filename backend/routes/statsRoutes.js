const express = require("express");
const router = express.Router();
const Criminal = require("../models/Criminal");
const Suspect = require("../models/Suspect");
const Complainant = require("../models/Complainant");

router.get("/", async (req, res) => {
  try {
    const totalCriminals = await Criminal.countDocuments();
    const totalSuspects = await Suspect.countDocuments();
    const totalComplainants = await Complainant.countDocuments();

    const genderStats = await Criminal.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    const stateStats = await Criminal.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalCriminals,
      totalSuspects,
      totalComplainants,
      genderStats,
      stateStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// This code defines a route for fetching statistics about criminals, suspects, and complainants.
// It aggregates data to provide counts of total records and