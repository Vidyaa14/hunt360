import { CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`flex-1 flex items-center justify-center p-6 transition-all duration-300`}
            >
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <img
                        src="/assets/logo1.png"
                        alt="Talent Corner Logo"
                        className="w-24 mx-auto mb-6"
                        aria-hidden="true"
                    />
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle
                            className="w-8 h-8 text-green-600 mr-2"
                            aria-hidden="true"
                        />
                        <h1 className="text-2xl font-bold text-[#5e239d]">
                            Thank You!
                        </h1>
                    </div>
                    <p
                        className="text-gray-600 mb-6"
                        role="alert"
                        aria-label="Form submission successful"
                    >
                        Your form has been submitted successfully.
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

FormSuccess.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

FormSuccess.defaultProps = {
    isSidebarCollapsed: false,
};

export default FormSuccess;
