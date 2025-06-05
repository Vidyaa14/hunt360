import { Router } from 'express';
import { createResponse, getResponses } from '../controllers/response.controller.js';
import { filterProfessionals } from '../controllers/professional.controller.js';

const router = Router();

/* Response Routes */
router.post('/response', createResponse);
router.get('/response', getResponses);

/* Professional Routes */
router.post('/professionals/filter', filterProfessionals);

export default router;