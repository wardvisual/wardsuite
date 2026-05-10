import { Router } from 'express';

// SCM
import supplierRoutes from './scm/supplier.routes';
import productRoutes from './scm/product.routes';
import purchaseRequestRoutes from './scm/purchase-request.routes';
import stockMovementRoutes from './scm/stock-movement.routes';

// CRM
import leadRoutes from './crm/lead.routes';
import customerRoutes from './crm/customer.routes';
import dealRoutes from './crm/deal.routes';
import activityRoutes from './crm/activity.routes';

// Core
import authRoutes from './auth.routes';
import statsRoutes from './stats.routes';

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
