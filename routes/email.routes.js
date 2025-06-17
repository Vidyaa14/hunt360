import { Router } from 'express';
import { deleteUser, getEmailHistory, getEmailStatus, getUsers, sendEmail, updateUser } from '../controllers/email.controller.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/send-email', upload.array('attachments'), sendEmail);
router.get('/email-status', getEmailStatus);
router.get('/email-history', getEmailHistory);
router.get('/users', getUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

export default router;