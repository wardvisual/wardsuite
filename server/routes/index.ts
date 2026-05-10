import { Router } from 'express';

// SCM
import supplierRoutes from './scm/supplierRoutes';
import productRoutes from './scm/productRoutes';
import purchaseRequestRoutes from './scm/purchaseRequestRoutes';
import stockMovementRoutes from './scm/stockMovementRoutes';

// CRM
import leadRoutes from './crm/leadRoutes';
import customerRoutes from './crm/customerRoutes';
import dealRoutes from './crm/dealRoutes';
import activityRoutes from './crm/activityRoutes';

// Core
import authRoutes from './authRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

// Auth
router.use('/auth', authRoutes);

// Dashboard
router.use('/dashboard', statsRoutes);

// SCM
router.use('/scm/suppliers', supplierRoutes);
router.use('/scm/products', productRoutes);
router.use('/scm/purchase-requests', purchaseRequestRoutes);
router.use('/scm/stock-movements', stockMovementRoutes);

// CRM
router.use('/crm/leads', leadRoutes);
router.use('/crm/customers', customerRoutes);
router.use('/crm/deals', dealRoutes);
router.use('/crm/activities', activityRoutes);

export default router;
