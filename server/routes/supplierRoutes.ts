import { Router } from "express";
import { supplierService } from "../services/supplierService";

const router = Router();

router.get("/", async (req, res) => {
  const items = await supplierService.getAll();
  res.json({ success: true, data: items });
});

router.post("/", async (req, res) => {
  const item = await supplierService.create(req.body);
  res.json({ success: true, data: item });
});

router.patch("/:id", async (req, res) => {
  const item = await supplierService.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ success: false });
  res.json({ success: true, data: item });
});

router.delete("/:id", async (req, res) => {
  const success = await supplierService.delete(req.params.id);
  res.json({ success });
});

export default router;
