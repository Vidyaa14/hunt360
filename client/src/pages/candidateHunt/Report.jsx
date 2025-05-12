/* eslint-disable no-unused-vars */
import { GraduationCap, UserCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();

    const handleClick = useCallback(
        (type) => {
            if (type === 'experienced') navigate('/dashboard/experienced');
            else if (type === 'freshers') navigate('/dashboard/freshers');
        },
        [navigate]
    );

    const handleKeyDown = useCallback(
        (e, type) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(type);
            }
        },
        [handleClick]
    );

    const cards = [
        {
            type: 'experienced',
            label: 'Experienced Candidate',
            icon: UserCheck,
            bgColor: 'bg-[#5a0ead]',
        },
        {
            type: 'freshers',
            label: 'Freshers',
            icon: GraduationCap,
            bgColor: 'bg-[#9333ea]',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`flex-1 p-10 transition-all duration-300`}
            >
                <h1 className="text-3xl font-bold text-[#55208d] mb-10 text-center">
                    Reports
                </h1>
                <div className="flex flex-wrap justify-center gap-8">
                    {cards.map(({ type, label, icon: Icon, bgColor }) => (
                        <div
                            key={type}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleClick(type)}
                            onKeyDown={(e) => handleKeyDown(e, type)}
                            className={`w-60 p-8 ${bgColor} text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 focus:ring-2 focus:ring-[#55208d] focus:ring-opacity-50 transition-all duration-300 flex flex-col items-center cursor-pointer outline-none`}
                            aria-label={`View ${label} report`}
                        >
                            <Icon className="w-10 h-10 mb-4" aria-hidden="true" />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

Reports.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

Reports.defaultProps = {
    isSidebarCollapsed: false,
};

export default Reports;