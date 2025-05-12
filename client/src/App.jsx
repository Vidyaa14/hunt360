import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/Signin';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/dashboard" element={
        // <ProtectedRoute>
        <Dashboard />
        // </ProtectedRoute>
      }
      >
        <Route index element={<div>Dashboard Home</div>} />
        <Route path="candidate-hunt" element={<div>Candidate Hunt Content</div>} />
        <Route path="job-search" element={<div>Job Search Content</div>} />
        <Route path="hr-hunt" element={<div>HR Hunt Content</div>} />
      </Route>
    </Routes>
  );
};

export default App;
