import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Sidebar from '../components/sidebar/Sidebar';

const FormError = ({ isSidebarCollapsed = false }) => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div
                className={`flex-1 flex items-center justify-center p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-[220px]'
                    }`}
            >
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <img
                        src="/assets/logo1.png"
                        alt="Talent Corner Logo"
                        className="w-24 mx-auto mb-6"
                        aria-hidden="true"
                    />
                    <div className="flex items-center justify-center mb-4">
                        <XCircle className="w-8 h-8 text-red-600 mr-2" aria-hidden="true" />
                        <h1 className="text-2xl font-bold text-[#5e239d]">
                            Something Went Wrong
                        </h1>
                    </div>
                    <p
                        className="text-gray-600 mb-6"
                        role="alert"
                        aria-label="Form submission failed"
                    >
                        Please try again or contact support.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-[#5e239d] text-white rounded-lg font-semibold hover:bg-[#4b1e84] focus:ring-2 focus:ring-[#5e239d] focus:ring-opacity-50 transition-all duration-200"
                        aria-label="Return to dashboard"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

FormError.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

FormError.defaultProps = {
    isSidebarCollapsed: false,
};

export default FormError;