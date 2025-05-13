import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CandidateDashboard from './pages/CandidateDashboard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';
import AdminLoginData from './pages/candidateHunt/AdminLoginData';
import BooleanSearch from './pages/candidateHunt/BooleanSearch';
import CandidateForm from './pages/candidateHunt/CandidateForm';
import CandidateRanking from './pages/candidateHunt/CandidateRanking';
import CandidateResults from './pages/candidateHunt/CandidateResults';
import DomainForm from './pages/candidateHunt/DomainForm';
import ExperienceJobBoard from './pages/candidateHunt/ExperienceJobBoard';
import FDFormData from './pages/candidateHunt/FDFormData';
import FilteredCandidates from './pages/candidateHunt/FilteredCandidates';
import FormError from './pages/candidateHunt/FormError';
import FormSuccess from './pages/candidateHunt/FormSuccess';
import FranchiseDataInput from './pages/candidateHunt/FranchiseDataInput';
import FranchiseeLoginData from './pages/candidateHunt/FranchiseeLoginData';
import FranchiseeOTP from './pages/candidateHunt/FranchiseeOTP';
import FranchiseeResetOTP from './pages/candidateHunt/FranchiseeResetOTP';
import FranchiseeResetPassword from './pages/candidateHunt/FranchiseeResetPassword';
import FranchiseeSignin from './pages/candidateHunt/FranchiseeSignin';
import FranchiseeSignup from './pages/candidateHunt/FranchiseeSignup';
import FreshersJobBoard from './pages/candidateHunt/FreshersJobBoard';
import ImportExcel from './pages/candidateHunt/ImportExcel';
import ImportedData from './pages/candidateHunt/ImportedData';
import LoginCandidate from './pages/candidateHunt/Login';
import Report from './pages/candidateHunt/Report';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/dashboard" element={<Dashboard />}>
                <Route path="candidate-hunt" element={<CandidateDashboard />}>
                    <Route index element={<Dashboard />} />
                    <Route path="franchise" element={<FranchiseeLoginData />} />
                    <Route path="job-board" element={<ExperienceJobBoard />} />
                    <Route path="reports" element={<Report />} />
                    <Route path="experienced" element={<ExperienceJobBoard />} />
                    <Route path="freshers" element={<FreshersJobBoard />} />
                    <Route path="filtered-candidates" element={<FilteredCandidates />} />
                    <Route path="franchisee-datainput" element={<FranchiseDataInput />} />
                    <Route path="fd-form-data" element={<FDFormData />} />
                    <Route path="candidate-ranking" element={<CandidateRanking />} />
                    <Route path="candidate-results" element={<CandidateResults />} />
                    <Route path="boolean-search" element={<BooleanSearch />} />
                    <Route path="admin-login-data" element={<AdminLoginData />} />
                    <Route path="import-excel" element={<ImportExcel />} />
                    <Route path="domain-form" element={<DomainForm />} />
                    <Route path="candidate-form" element={<CandidateForm />} />
                    <Route path="form-error" element={<FormError />} />
                    <Route path="form-success" element={<FormSuccess />} />
                    <Route path="franchisee-otp" element={<FranchiseeOTP />} />
                    <Route path="franchisee-reset-otp" element={<FranchiseeResetOTP />} />
                    <Route path="franchisee-reset-password" element={<FranchiseeResetPassword />} />
                    <Route path="franchisee-signin" element={<FranchiseeSignin />} />
                    <Route path="franchisee-signup" element={<FranchiseeSignup />} />
                    <Route path="imported-data" element={<ImportedData />} />
                    <Route path="login-candidate" element={<LoginCandidate />} />
                </Route>

                <Route path="job-search" element={<div>Job Search Content</div>} />
                <Route path="hr-hunt" element={<div>HR Hunt Content</div>} />
            </Route>
        </Routes>
    );
};

export default App;
