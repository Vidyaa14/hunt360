import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarAction from './SidebarAction';
import { Users, Building, Briefcase, FileText, Search } from 'lucide-react';

const LogoutIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path d="M10 2v2H4v16h6v2H2V2h8zm3.707 5.707L18.414 12l-4.707 4.293-1.414-1.414L15.586 12l-3.293-3.293 1.414-1.414z" />
    </svg>
);

const navLinks = [
    { to: '/dashboard', label: 'Candidate Data', icon: Users },
    { to: '/dashboard/franchise', label: 'Franchises Data', icon: Building },
    { to: '/dashboard/job-board', label: 'Job Board', icon: Briefcase },
    { to: '/dashboard/reports', label: 'Reports', icon: FileText },
    { to: '/dashboard/boolean-search', label: 'Boolean Search', icon: Search },
];

const Sidebar = ({
    onToggleDataSidebar,
    isCollapsed: initialCollapsed = false,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

    const handleToggle = useCallback(() => {
        setIsCollapsed((prev) => !prev);
        if (onToggleDataSidebar) {
            onToggleDataSidebar(!isCollapsed);
        }
    }, [onToggleDataSidebar, isCollapsed]);

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-[#54397e] text-white flex flex-col transition-all duration-300 ${
                isCollapsed ? 'w-16 p-2' : 'w-[220px] p-5'
            }`}
            aria-label="Sidebar navigation"
        >
            <button
                onClick={handleToggle}
                className="absolute top-4 right-4 text-white hover:text-gray-200 focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    zz
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
                    />
                </svg>
            </button>

            {!isCollapsed && (
                <div className="text-center mb-6">
                    <img
                        src="/logo.png"
                        alt="Talent Corner"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md mx-auto"
                    />
                </div>
            )}

            {!isCollapsed && (
                <div className="text-center text-xl font-bold bg-[#432c65] rounded-lg py-2 mb-6 shadow-lg truncate">
                    Talent Corner
                </div>
            )}

            <nav
                className={`flex flex-col gap-2 mb-6 flex-grow ${isCollapsed ? 'mt-16' : 'mt-0'}`}
                aria-label="Main navigation"
            >
                {navLinks.map(({ to, label, icon: Icon }) => (
                    <div key={to} className="relative group">
                        <SidebarLink
                            to={to}
                            isCollapsed={isCollapsed}
                            icon={Icon}
                        >
                            {label}
                        </SidebarLink>
                        {isCollapsed && (
                            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                {label}
                            </span>
                        )}
                    </div>
                ))}
            </nav>

            <SidebarAction
                to="/login"
                icon={LogoutIcon}
                isCollapsed={isCollapsed}
            >
                Sign Out
            </SidebarAction>
        </div>
    );
};

Sidebar.propTypes = {
    onToggleDataSidebar: PropTypes.func,
    isCollapsed: PropTypes.bool,
};

Sidebar.defaultProps = {
    isCollapsed: false,
};

export default React.memo(Sidebar);
