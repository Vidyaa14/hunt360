import { Router } from 'express';
import { sendEmail, getEmailStatus, getEmailHistory } from '../controllers/email.controller.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/send-email', upload.array('attachments'), sendEmail);
router.get('/email-status', getEmailStatus);
router.get('/email-history', getEmailHistory);

export default router;