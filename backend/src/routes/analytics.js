const express = require("express");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/analytics/summary - Aggregated statistics
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    // Total traffic logs
    const { count: totalLogs } = await supabase
      .from("traffic_logs")
      .select("*", { count: "exact", head: true });

    // Total violations
    const { count: totalViolations } = await supabase
      .from("violations")
      .select("*", { count: "exact", head: true });

    // Total junctions
    const { count: totalJunctions } = await supabase
      .from("junctions")
      .select("*", { count: "exact", head: true });

    // Recent traffic data for density distribution
    const { data: recentLogs } = await supabase
      .from("traffic_logs")
      .select("density")
      .limit(500);

    const densityDistribution = { Low: 0, Medium: 0, High: 0 };
    if (recentLogs) {
      recentLogs.forEach((log) => {
        densityDistribution[log.density]++;
      });
    }

    res.json({
      totalLogs,
      totalViolations,
      totalJunctions,
      densityDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/trends - Traffic trends over time
router.get("/trends", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("traffic_logs")
      .select("timestamp, cars, bikes, buses, trucks, total, density")
      .order("timestamp", { ascending: true })
      .limit(100);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/vehicle-distribution - Vehicle type distribution
router.get("/vehicle-distribution", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("traffic_logs")
      .select("cars, bikes, buses, trucks")
      .limit(500);

    if (error) throw error;

    const totals = { cars: 0, bikes: 0, buses: 0, trucks: 0 };
    if (data) {
      data.forEach((log) => {
        totals.cars += log.cars;
        totals.bikes += log.bikes;
        totals.buses += log.buses;
        totals.trucks += log.trucks;
      });
    }

    res.json(totals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/junctions - Per-junction stats
router.get("/junctions", authenticateToken, async (req, res) => {
  try {
    const { data: junctions } = await supabase.from("junctions").select("*");

    const results = [];
    for (const junction of junctions || []) {
      const { count: logCount } = await supabase
        .from("traffic_logs")
        .select("*", { count: "exact", head: true })
        .eq("junction_id", junction.id);

      const { count: violationCount } = await supabase
        .from("violations")
        .select("*", { count: "exact", head: true })
        .eq("junction_id", junction.id);

      const { data: latestLog } = await supabase
        .from("traffic_logs")
        .select("density, green_time, total")
        .eq("junction_id", junction.id)
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      results.push({
        ...junction,
        logCount,
        violationCount,
        latestDensity: latestLog?.density || "N/A",
        latestGreenTime: latestLog?.green_time || 0,
        latestTotal: latestLog?.total || 0,
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
