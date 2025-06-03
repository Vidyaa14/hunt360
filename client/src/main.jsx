import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { JobProvider } from './contexts/JobContext.jsx';
import { ResumeProvider } from './contexts/ResumeContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ResumeProvider>
                    <JobProvider>
                        <App />
                    </JobProvider>
                </ResumeProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
