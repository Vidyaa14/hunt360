import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    BarChart2,
    FileUp,
    Database,
    Users,
    Award,
    Lock,
} from 'lucide-react';

const DataSidebar = () => {
    const location = useLocation();
    const activePath = location.pathname;
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const links = [
        {
            to: '/dashboard',
            label: 'Data Visualization',
            icon: <BarChart2 className="w-5 h-5" />,
            ariaLabel: 'Navigate to Data Visualization',
        },
        {
            to: '/import-excel',
            label: 'Import Excel',
            icon: <FileUp className="w-5 h-5" />,
            ariaLabel: 'Navigate to Import Excel',
        },
        {
            to: '/imported-data',
            label: 'Imported Data',
            icon: <Database className="w-5 h-5" />,
            ariaLabel: 'Navigate to Imported Data',
        },
        {
            to: '/dashboard/fd-form-data',
            label: 'Freshers Data',
            icon: <Users className="w-5 h-5" />,
            ariaLabel: 'Navigate to Freshers Data',
        },
        {
            to: '/dashboard/candidate-ranking',
            label: "Candidate's Ranking",
            icon: <Award className="w-5 h-5" />,
            ariaLabel: "Navigate to Candidate's Ranking",
        },
        {
            to: '/admin-login-data',
            label: 'Admin Login Data',
            icon: <Lock className="w-5 h-5" />,
            ariaLabel: 'Navigate to Admin Login Data',
        },
    ];

    return (
        <div
            className={`fixed top-0 right-0 ${
                isCollapsed ? 'w-12' : 'w-64'
            } bg-[#411f58] text-white h-screen ${isCollapsed ? 'p-2' : 'p-4'} z-50 shadow-lg animate-fade-in transition-all duration-300 overflow-y-auto`}
            role="navigation"
            aria-label="Candidate Data Sidebar"
        >
            <button
                className="absolute top-2 right-2 rounded-full bg-[#622e7a] hover:bg-[#7a3a9a] p-1.5 focus:ring-2 focus:ring-[#622e7a] transition-all duration-200"
                onClick={toggleSidebar}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isCollapsed ? (
                    <ChevronLeft className="w-5 h-5" />
                ) : (
                    <ChevronRight className="w-5 h-5" />
                )}
            </button>

            {!isCollapsed && (
                <div className="flex flex-col h-full">
                    <div className="mb-4">
                        <img
                            src="/logo.png"
                            alt="Talent Corner Logo"
                            className="h-12 mx-auto mb-4"
                            aria-hidden="true"
                        />
                        <div className="text-lg font-bold flex flex-col gap-2">
                            <span className="bg-gradient-to-r from-[#411f58] to-[#622e7a] bg-clip-text text-transparent">
                                Candidate Data
                            </span>
                            <hr className="border-t border-gray-400 my-2" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2 text-white p-2 rounded-lg hover:bg-[#622e7a] transition-all duration-200 ${
                                    activePath === link.to ? 'bg-[#622e7a]' : ''
                                } focus:ring-2 focus:ring-[#622e7a]`}
                                aria-current={
                                    activePath === link.to ? 'page' : undefined
                                }
                                aria-label={link.ariaLabel}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {isCollapsed && (
                <div className="flex flex-col gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex justify-center text-white p-2 rounded-lg hover:bg-[#622e7a] transition-all duration-200 ${
                                activePath === link.to ? 'bg-[#622e7a]' : ''
                            } focus:ring-2 focus:ring-[#622e7a]`}
                            aria-current={
                                activePath === link.to ? 'page' : undefined
                            }
                            aria-label={link.ariaLabel}
                            title={link.label}
                        >
                            {link.icon}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

DataSidebar.propTypes = {
    // No props needed
};

export default DataSidebar;
