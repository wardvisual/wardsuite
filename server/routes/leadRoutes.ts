import { Router } from "express";
import { leadService } from "../services/leadService";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const leads = await leadService.getAllLeads();
    res.json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch leads" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newLead = await leadService.createLead(req.body);
    res.json({ success: true, data: newLead });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create lead" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedLead = await leadService.updateLead(req.params.id, req.body);
    if (!updatedLead) return res.status(404).json({ success: false, error: "Lead not found" });
    res.json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update lead" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await leadService.deleteLead(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Lead not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete lead" });
  }
});

export default router;
