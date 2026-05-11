import { Router } from 'express';

// Auth
import authRoutes from '@server/modules/auth/auth.routes';
import usersRoutes from '@server/modules/users/users.routes';

// Dashboard
import dashboardRoutes from '@server/modules/dashboard/dashboard.routes';

// CRM
import leadsRoutes from '@server/modules/crm/leads/leads.routes';
import customersRoutes from '@server/modules/crm/customers/customers.routes';
import dealsRoutes from '@server/modules/crm/deals/deals.routes';
import activitiesRoutes from '@server/modules/crm/activities/activities.routes';

// SCM
import suppliersRoutes from '@server/modules/scm/suppliers/suppliers.routes';
import productsRoutes from '@server/modules/scm/products/products.routes';
import purchaseRequestsRoutes from '@server/modules/scm/purchase-requests/purchase-requests.routes';
import stockMovementsRoutes from '@server/modules/scm/stock-movements/stock-movements.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
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
