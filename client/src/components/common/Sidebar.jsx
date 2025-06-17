import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
    BarChart2,
    Briefcase,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Circle,
    FileText,
    Home,
    Save,
    Search,
    Settings,
    Database,
    User,
    Wand,
    Edit,
    Megaphone,
    BookOpen,
    Users,
    Calendar,
    BarChart,
    LayoutDashboard,
    BriefcaseBusinessIcon,
    Info,
    Shield,
    Edit2Icon,
    HomeIcon,
    Contact,
    Settings2Icon,
    Bookmark,
    Upload,
    FileSearch,
    BookTemplate,
    Send,
    TowerControl,
    Building,
    Users2,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = useCallback((label) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    }, []);

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        {
            to: '/job-search',
            icon: Search,
            label: 'Job Search',
            children: [
                { to: '/dashboard/jobsearch', icon: Search, label: 'Search Jobs' },
                { to: '/dashboard/savedjobs', icon: Save, label: 'Saved Jobs' },
            ],
        },
        {
            to: '/hr-hunt',
            icon: BriefcaseBusinessIcon,
            label: 'HR Hunt',
            children: [
                { to: '/dashboard/hr-hunt/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { to: '/dashboard/hr-hunt/about-us', icon: Info, label: 'About Us' },
                { to: '/dashboard/hr-hunt/admin-dashboard', icon: Shield, label: 'Admin Dashboard' },
                { to: '/dashboard/hr-hunt/profile-details', icon: User, label: 'Profile Details' },
                { to: '/dashboard/hr-hunt/landing-page', icon: HomeIcon, label: 'Landing Page' },
                { to: '/dashboard/hr-hunt/profile-page', icon: Contact, label: 'Profile Page' },
                { to: '/dashboard/hr-hunt/profile-settings', icon: Settings2Icon, label: 'Profile Settings' },
                { to: '/dashboard/hr-hunt/saved-professionals', icon: Bookmark, label: 'Saved Professionals' },
            ],
        },
        {
            to: '/corporate',
            icon: User,
            label: 'Corporate Hunt',
            children: [
                { to: '/dashboard/corporate/dashboard', icon: Home, label: 'Dashboard' },
                { to: '/dashboard/corporate/data-scraping', icon: Database, label: 'Data Scraping' },
                { to: '/dashboard/corporate/bulk-data-cleaning', icon: Wand, label: 'Bulk Data Cleaning' },
                { to: '/dashboard/corporate/single-data-edit', icon: Edit, label: 'Single Data Edit' },
                { to: '/dashboard/corporate/marketing-data', icon: Megaphone, label: 'Marketing Data' },
            ],
        },
        {
            to: '/campus',
            icon: BookOpen,
            label: 'Campus',
            children: [
                { to: '/dashboard/campus/dashboard', icon: Home, label: 'Dashboard' },
                { to: '/dashboard/campus/data-catascraping', icon: Database, label: 'Data Scraping' },
                { to: '/dashboard/campus/bulk-editing', icon: Wand, label: 'Bulk Editing' },
                { to: '/dashboard/campus/single-editing', icon: Edit, label: 'Single Editing' },
                { to: '/dashboard/campus/marketing-data', icon: Megaphone, label: 'Marketing Data' },
                { to: '/dashboard/campus/hrdata', icon: Users, label: 'HR Data' },
                { to: '/dashboard/campus/reports', icon: BarChart, label: 'Reports' },
                { to: '/dashboard/campus/settings', icon: Settings, label: 'Settings' },
                { to: '/dashboard/campus/meeting-schedule', icon: Calendar, label: 'Meeting Schedule' },
                { to: '/dashboard/campus/user-management', icon: Users, label: 'User Management' },
            ],
        },
        {
            to: '/resume-hunt',
            icon: FileSearch,
            label: 'Resume Hunt',
            children: [
                {
                    to: '/dashboard/resume-hunt/resume-upload',
                    icon: Upload,
                    label: 'Upload Resume',
                },
                {
                    to: '/dashboard/resume-hunt/resume-search',
                    icon: Search,
                    label: 'Search Resume',
                },
            ],
        },
        {
            to: '/dashboard/email-service', icon: BookTemplate, label: "Email Service",
            children: [
                { to: '/dashboard/email-service/email-history', icon: BookTemplate, label: 'Email History' },
                { to: '/dashboard/email-service/email-sent', icon: Send, label: 'Send Emails' },
                { to: '/dashboard/email-service/email-status', icon: TowerControl, label: 'Email Status' },
                { to: '/dashboard/email-service/users-list', icon: Users2, label: 'Users List' },

            ],
        },
        {
            to: '/dashboard/campus', icon: Building, label: 'Campus',
            children: [
            ]
        },
        { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-30
        ${isOpen ? 'w-64' : 'w-16'} md:relative md:shadow-none
      `}
            aria-label="Main navigation"
        >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                {isOpen && (
                    <div className="flex items-center space-x-3">
                        <img src="/logo.png" alt="Hunt360 Logo" className="h-8 w-auto" />
                        <span className="text-lg font-semibold text-gray-900">Hunt360</span>
                    </div>
                )}
                <button
                    className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleSidebar}
                    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="mt-4 px-2" aria-label="Sidebar navigation">
                {navItems.map((item) => {
                    const isDropdown = !!item.children;
                    const isDropdownOpen = openDropdowns[item.label];

                    const content = (
                        <div
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${isDropdown ? 'cursor-pointer hover:bg-gray-100 text-gray-700' : ''}`}
                            onClick={() => isDropdown && toggleDropdown(item.label)}
                            role={isDropdown ? 'button' : undefined}
                            aria-haspopup={isDropdown ? 'true' : undefined}
                            aria-expanded={isDropdown ? isDropdownOpen : undefined}
                        >
                            <item.icon size={18} className="text-gray-500" />
                            {isOpen && (
                                <div className="ml-3 flex-1 flex justify-between items-center">
                                    <span>{item.label}</span>
                                    {isDropdown && (
                                        <span className="text-gray-400">
                                            {isDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <div key={item.label} className="relative group">
                            {isDropdown ? (
                                content
                            ) : (
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600' : 'text-gray-700 hover:bg-gray-100'}`
                                    }
                                    aria-label={item.label}
                                >
                                    <item.icon size={18} className="text-gray-500" />
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                </NavLink>
                            )}

                            {!isOpen && (
                                <span
                                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 whitespace-nowrap"
                                    role="tooltip"
                                >
                                    {item.label}
                                </span>
                            )}

                            {isDropdown && isDropdownOpen && isOpen && (
                                <div className="ml-4 mt-1 pb-2 border-l border-gray-200">
                                    {item.children.map((child) => (
                                        <NavLink
                                            key={child.to}
                                            to={child.to}
                                            className={({ isActive }) =>
                                                `flex items-center px-3 py-2 text-sm font-medium transition-colors duration-150
                        ${isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'}`
                                            }
                                            aria-label={child.label}
                                        >
                                            <child.icon size={16} className="mr-3 text-gray-400" />
                                            <span>{child.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default memo(Sidebar);