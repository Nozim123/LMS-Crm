import { Router } from 'express';
import { createInvoice, createPayment, debtSummary, listInvoices } from '../controllers/payment.controller.js';

const router = Router();

router.get('/invoices', listInvoices);
router.post('/invoices', createInvoice);
router.post('/payments', createPayment);
router.get('/debts', debtSummary);

export default router;
