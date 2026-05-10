import { Router } from 'express';

// Auth
import authRoutes from './modules/auth/auth.routes';

// Dashboard
import dashboardRoutes from './modules/dashboard/dashboard.routes';

// CRM
import leadsRoutes from './modules/crm/leads/leads.routes';
import customersRoutes from './modules/crm/customers/customers.routes';
import dealsRoutes from './modules/crm/deals/deals.routes';
import activitiesRoutes from './modules/crm/activities/activities.routes';

// SCM
import suppliersRoutes from './modules/scm/suppliers/suppliers.routes';
import productsRoutes from './modules/scm/products/products.routes';
import purchaseRequestsRoutes from './modules/scm/purchase-requests/purchase-requests.routes';
import stockMovementsRoutes from './modules/scm/stock-movements/stock-movements.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

router.use('/crm/leads', leadsRoutes);
router.use('/crm/customers', customersRoutes);
router.use('/crm/deals', dealsRoutes);
router.use('/crm/activities', activitiesRoutes);

router.use('/scm/suppliers', suppliersRoutes);
router.use('/scm/products', productsRoutes);
router.use('/scm/purchase-requests', purchaseRequestsRoutes);
router.use('/scm/stock-movements', stockMovementsRoutes);

export default router;
