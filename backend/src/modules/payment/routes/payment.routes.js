import { Router } from 'express';
import { createPayment, listInvoices } from '../controllers/payment.controller.js';

const router = Router();

router.get('/invoices', listInvoices);
router.post('/payments', createPayment);

export default router;
