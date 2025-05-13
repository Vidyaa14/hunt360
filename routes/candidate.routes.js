import express from 'express';
import * as candidateController from '../controllers/candidate.controller.js';

const router = express.Router();

router.post('/filterCandidates', candidateController.ensureLoggedIn, candidateController.filterCandidates);
router.post('/sendCandidateEmail', candidateController.ensureLoggedIn, candidateController.sendCandidateEmail);
router.get('/orgEmailCount', candidateController.getOrgEmailCount);
router.get('/dashboardData', candidateController.getDashboardData);
router.get('/candidate-by-year', candidateController.getCandidateByYear);
router.get('/candidate-by-domain', candidateController.getCandidateByDomain);
router.get('/candidate-by-subdomain', candidateController.getCandidateBySubdomain);
router.post('/verifyToken', candidateController.verifyToken);
router.post('/submitCandidate', candidateController.ensureLoggedIn, candidateController.submitCandidate);

export default router;