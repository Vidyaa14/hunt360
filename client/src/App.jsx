import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import JobHomePage from './pages/JobHome';
import Login from './pages/Login';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';
import SavedJobsPage from './pages/SavedJobsPage';
import CorporateDashboard from './features/corporate/pages/Dashboard';
import SingleDataEdit from './features/corporate/pages/SingleDataEdit';
import Reports from './features/corporate/pages/Reports';
import MarketingData from './features/corporate/pages/MarketingData';
import DataScraping from './features/corporate/pages/DataScraping';
import BulkDataCleaning from './features/corporate/pages/BulkDataCleaning';
import CampusDashboard from './features/campus/pages/Dashboard';
import CampusDataScraping from './features/campus/pages/DataScraping';
import HRData from './features/campus/pages/HRData';
import BulkEditing from './features/campus/pages/BulkEditing';
import CampusReports from './features/campus/pages/Reports';
import UserManagement from './features/campus/pages/UserManagement';
import Settings from './features/campus/pages/Settings';
import MeetingSchedule from './features/campus/pages/MeetingSchedule';


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route path="jobsearch" element={<JobHomePage />} />
                <Route path="savedjobs" element={<SavedJobsPage />} />
                <Route path="hrhunt" element={<div>HR Hunt Content</div>} />
                <Route path="corporate">
                    <Route path="dashboard" element={<CorporateDashboard />} />
                    <Route path="data-scraping" element={<DataScraping />} />
                    <Route path="bulk-data-cleaning" element={<BulkDataCleaning />} />
                    <Route path="single-data-edit" element={<SingleDataEdit />} />
                    <Route path="marketing-data" element={<MarketingData />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
                <Route path="campus">
                    <Route path="dashboard" element={<CampusDashboard />} />
                    <Route path="data-scraping" element={<CampusDataScraping />} />
                    <Route path="bulk-editing" element={<BulkEditing />} />
                    <Route path="single-editing" element={<SingleDataEdit />} />
                    <Route path="marketing-data" element={<MarketingData />} />
                    <Route path="hrdata" element={<HRData />} />
                    <Route path="reports" element={<CampusReports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="meeting-schedule" element={<MeetingSchedule />} />
                    <Route path="user-management" element={<UserManagement />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
