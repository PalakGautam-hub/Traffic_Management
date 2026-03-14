const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/junctions - Get all junctions
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("junctions")
      .select("*")
      .order("name");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/junctions - Create a junction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    const { data, error } = await supabase
      .from("junctions")
      .insert([{ name, location }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
