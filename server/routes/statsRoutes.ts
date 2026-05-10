import { Router } from "express";
import { statsService } from "../services/statsService";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard stats"
    });
  }
});

export default router;
