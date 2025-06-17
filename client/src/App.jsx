import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import BulkEditing from './features/campus/pages/BulkEditing';
import CampusDashboard from './features/campus/pages/Dashboard';
import CampusDataScraping from './features/campus/pages/DataScraping';
import HRData from './features/campus/pages/HRData';
import MeetingSchedule from './features/campus/pages/MeetingSchedule';
import CampusReports from './features/campus/pages/Reports';
import Settings from './features/campus/pages/Settings';
import UserManagement from './features/campus/pages/UserManagement';
import BulkDataCleaning from './features/corporate/pages/BulkDataCleaning';
import CorporateDashboard from './features/corporate/pages/Dashboard';
import DataScraping from './features/corporate/pages/DataScraping';
import MarketingData from './features/corporate/pages/MarketingData';
import Reports from './features/corporate/pages/Reports';
import SingleDataEdit from './features/corporate/pages/SingleDataEdit';
import AboutUs from './features/hr/pages/AboutUs';
import HRAdminDashboard from './features/hr/pages/AdminDashboard';
import HRHuntDashboard from './features/hr/pages/Dashboard';
import HREditContactForm from './features/hr/pages/EditContactForm';
import HRProfileDetails from './features/hr/pages/HRProfileDetails';
import HRLandingPage from './features/hr/pages/LandingPage';
import HRProfilePage from './features/hr/pages/ProfilePage';
import HRProfileSettings from './features/hr/pages/ProfileSettings';
import HRSavedProfessionals from './features/hr/pages/SavedProfessionals';
import Dashboard from './pages/Dashboard';
import JobHomePage from './pages/JobHome';
import Login from './pages/Login';
import SavedJobsPage from './pages/SavedJobsPage';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';
import SettingsPage from './pages/Settings';
import ResumeUpload from './features/resumehunt/pages/UploadResumes';
import ResumeSearch from './features/resumehunt/pages/SearchResumes';
import EmailStatus from './components/email/EmailStatus';
import EmailHistory from './components/email/EmailHistory';
import EmailSend from './components/email/SendEmail';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            >
                <Route path="settings" element={<SettingsPage />} />
                <Route path="jobsearch" element={<JobHomePage />} />
                <Route path="savedjobs" element={<SavedJobsPage />} />
                <Route path="hrhunt" element={<div>HR Hunt Content</div>} />
                <Route path="corporate">
                    <Route path="dashboard" element={<CorporateDashboard />} />
                    <Route path="data-scraping" element={<DataScraping />} />
                    <Route
                        path="bulk-data-cleaning"
                        element={<BulkDataCleaning />}
                    />
                    <Route
                        path="single-data-edit"
                        element={<SingleDataEdit />}
                    />
                    <Route path="marketing-data" element={<MarketingData />} />
                    <Route path="reports" element={<Reports />} />
                </Route>
                <Route path="campus">
                    <Route path="dashboard" element={<CampusDashboard />} />
                    <Route
                        path="data-scraping"
                        element={<CampusDataScraping />}
                    />
                    <Route path="bulk-editing" element={<BulkEditing />} />
                    <Route path="single-editing" element={<SingleDataEdit />} />
                    <Route path="marketing-data" element={<MarketingData />} />
                    <Route path="hrdata" element={<HRData />} />
                    <Route path="reports" element={<CampusReports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route
                        path="meeting-schedule"
                        element={<MeetingSchedule />}
                    />
                    <Route
                        path="user-management"
                        element={<UserManagement />}
                    />
                </Route>

                <Route path="hr-hunt">
                    <Route index element={<HRHuntDashboard />} />
                    <Route path="dashboard" element={<HRHuntDashboard />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="admin-dashboard" element={<HRAdminDashboard />} />
                    <Route path="edit-contact-form" element={<HREditContactForm />} />
                    <Route path="profile-details" element={<HRProfileDetails />} />
                    <Route path="landing-page" element={<HRLandingPage />} />
                    <Route path="profile-page" element={<HRProfilePage />} />
                    <Route path="profile-settings" element={<HRProfileSettings />} />
                    <Route path="saved-professionals" element={<HRSavedProfessionals />} />
                </Route>

                <Route path="resume-hunt">
                    <Route index element={<ResumeSearch />} />
                    <Route path="resume-search" element={<ResumeSearch />} />
                    <Route path="resume-upload" element={<ResumeUpload />} />
                </Route>

                <Route path="email-service">
                    <Route index element={<EmailSend />} />
                    <Route path="email-sent" element={<EmailSend />} />
                    <Route path="email-history" element={<EmailHistory />} />
                    <Route path="email-status" element={<EmailStatus />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
