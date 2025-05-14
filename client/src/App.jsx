import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route path="job-search" element={<div>Job Search Content</div>} />
                <Route path="hr-hunt" element={<div>HR Hunt Content</div>} />
            </Route>
        </Routes>
    );
};

export default App;
