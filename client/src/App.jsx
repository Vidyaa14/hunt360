import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import JobHomePage from './pages/JobHome';
import Login from './pages/Login';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';
import SavedJobsPage from './pages/SavedJobsPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route path="jobsearch" element={<JobHomePage />} />
                <Route path="savedjobs" element={<SavedJobsPage /> } />
                <Route path="hrhunt" element={<div>HR Hunt Content</div>} />
            </Route>
        </Routes>
    );
};

export default App;
