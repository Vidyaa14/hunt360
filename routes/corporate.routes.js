import { Router } from 'express';
import {
    getCompanyYearTrends,
    getAnalytics,
    getYearlyTrends,
} from '../controllers/analytics.controller.js';
import {
    getDashboard,
    getUpcomingMeetings,
} from '../controllers/dashboard.controller.js';
import {
    addCompany,
    cleanDuplicates,
    deleteRecord,
    getDataStats,
    getPreviousScrapes,
    saveForm,
    searchCompanies,
    searchMarketingData,
    uploadFile,
} from '../controllers/data.controller.js';
import {
    getBdComparison,
    getCommunicationStatusOverview,
    getLatestCommunication,
    getLeadStatusDistribution,
    getLocationWiseLeadCount,
    getReportSummary,
    getStateWiseBdActivities,
    reportsCSV,
} from '../controllers/report.controller.js';
import { scrape } from '../controllers/scrape.controller.js';

const router = Router();

/* analytics routes */
router.get('/analytics', getAnalytics);
router.get('/trends/yearly', getYearlyTrends);
router.get('/trends/company-year', getCompanyYearTrends);

/* dashboard routes */
router.get('/dashboard', getDashboard);
router.get('/upcoming-meetings', getUpcomingMeetings);

/* data routes */
router.post('/upload', uploadFile);
router.delete('/clean-duplicates', cleanDuplicates);
router.get('/data-stats', getDataStats);
router.get('/previous-scrapes', getPreviousScrapes);
router.get('/search-companies', searchCompanies);
router.get('/search-marketing-data', searchMarketingData);
router.post('/save-form', saveForm);
router.delete('/delete/:id', deleteRecord);
router.post('/add-company', addCompany);

/* scrape routes */
router.post('/scrape', scrape);

/* report routes */
router.get('/latest-communication', getLatestCommunication);
router.get('/report-summary', getReportSummary);
router.get('/bd-comparison', getBdComparison);
router.get('/lead-status-distribution', getLeadStatusDistribution);
router.get('/communication-status-overview', getCommunicationStatusOverview);
router.get('/location-wise-lead-count', getLocationWiseLeadCount);
router.get('/state-wise-bd-activities', getStateWiseBdActivities);
router.post('/reports/csv', reportsCSV)

export default router;
