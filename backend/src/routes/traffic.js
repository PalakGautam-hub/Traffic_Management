const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");
const { validateTrafficData } = require("../middleware/validate");

const router = express.Router();

// POST /api/traffic - Submit traffic data (from ML service)
router.post("/", validateTrafficData, async (req, res) => {
  try {
    const { junction_id, cars, bikes, buses, trucks, total, density, green_time } = req.body;

    const { data, error } = await supabase
      .from("traffic_logs")
      .insert([{ junction_id, cars, bikes, buses, trucks, total, density, green_time }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/traffic/:junctionId - Get traffic logs per junction
router.get("/:junctionId", authenticateToken, async (req, res) => {
  try {
    const { junctionId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from("traffic_logs")
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

// GET /api/traffic - Get all recent traffic logs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from("traffic_logs")
      .select("*, junctions(name, location)")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
