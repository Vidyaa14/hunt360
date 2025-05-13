import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FranchiseSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div
            className={`fixed top-0 right-0 w-64 h-full bg-indigo-900 text-white p-5 transition-transform duration-300 ease-in-out transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } shadow-lg z-30`}
        >
            <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-white font-bold text-lg">
                Candidate Data
                <span
                    className="cursor-pointer text-xl hover:text-red-400 transition-colors duration-200"
                    onClick={onClose}
                >
                    ✖
                </span>
            </div>
            <div
                className={`p-3 cursor-pointer rounded-md mb-2 transition-all duration-200 ${
                    location.pathname.includes('dashboard')
                        ? 'bg-indigo-800 border-l-4 border-red-400'
                        : 'hover:bg-indigo-700 hover:scale-102'
                }`}
                onClick={() => handleNavigation('/dashboard')}
            >
                Data Visualization
            </div>
            <div
                className={`p-3 cursor-pointer rounded-md mb-2 transition-all duration-200 ${
                    location.pathname.includes('datainput')
                        ? 'bg-indigo-800 border-l-4 border-red-400'
                        : 'hover:bg-indigo-700 hover:scale-102'
                }`}
                onClick={() =>
                    handleNavigation('/dashboard-franchise/datainput')
                }
            >
                View Candidate Data
            </div>
        </div>
    );
};

export default FranchiseSidebar;
