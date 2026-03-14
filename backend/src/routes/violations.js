const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");
const { validateViolation } = require("../middleware/validate");

const router = express.Router();

// POST /api/violations - Store a violation (from ML service)
router.post("/", validateViolation, async (req, res) => {
  try {
    const { junction_id, vehicle_type, image_url } = req.body;

    const { data, error } = await supabase
      .from("violations")
      .insert([{ junction_id, vehicle_type, image_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/violations - Get all violations
router.get("/", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from("violations")
      .select("*, junctions(name, location)")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/violations/:junctionId - Get violations for a junction
router.get("/:junctionId", authenticateToken, async (req, res) => {
  try {
    const { junctionId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from("violations")
      .select("*")
      .eq("junction_id", junctionId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
