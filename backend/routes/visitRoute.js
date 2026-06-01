
const express = require('express');
const router = express.Router();

const Visit = require("../models/Visit");
router.get("/visits", async (req, res) => {
  try {
    const visit = await Visit.findOneAndUpdate(
      { page: "home" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.json({ visits: visit.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to update visits" });
  }
});
module.exports = router;
