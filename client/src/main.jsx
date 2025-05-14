import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { JobProvider } from './contexts/JobContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <JobProvider>
                    <App />
                </JobProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
