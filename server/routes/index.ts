import { Router } from "express";
import statsRoutes from "./statsRoutes";
import leadRoutes from "./leadRoutes";
import supplierRoutes from "./supplierRoutes";

const router = Router();

router.use("/dashboard", statsRoutes);
router.use("/leads", leadRoutes);
router.use("/suppliers", supplierRoutes);

export default router;
