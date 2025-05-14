import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    BarChart2,
    FileText,
    Search,
    Briefcase,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Circle,
    Save,
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (label) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/analytics', icon: BarChart2, label: 'Analytics' },
        {
            to: '/reports',
            icon: FileText,
            label: 'Reports',
            children: [
                { to: '/reports/summary', label: 'Summary' },
                { to: '/reports/detailed', label: 'Detailed' },
            ],
        },
        {
            to: '/dashboard',
            icon: Search,
            label: 'Job Search',
            children: [
                { to: '/dashboard/jobsearch', icons: Search, label: 'Search Jobs' },
                { to: '/dashboard/savedjobs', icons: Save, label: 'Saved Jobs' },
            ]
        },
        { to: '/hrhunt', icon: Briefcase, label: 'HR Hunt' },
        { to: '/profile', icon: User, label: 'Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-30
                ${isOpen ? 'w-64' : 'w-16'}
                md:relative md:shadow-none
            `}
        >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 overflow-hidden">
                    {isOpen && (
                        <>
                            <img src="/logo.png" alt="Hunt360 Logo" className="h-8 w-auto" />
                            <span className="text-lg font-semibold text-gray-900">Hunt360</span>
                        </>
                    )}
                </div>
                <button
                    className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="mt-4 px-2">
                {navItems.map((item) => {
                    const isDropdown = !!item.children;
                    const isDropdownOpen = openDropdowns[item.label];

                    const content = (
                        <div
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                            ${isDropdown ? 'cursor-pointer hover:bg-gray-100 text-gray-700' : ''}
                            `}
                            onClick={() => isDropdown && toggleDropdown(item.label)}
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
                                        `flex items-center w-full px-3 py-2.5 rounded-lg transition-colors duration-200 mt-1
                                        ${isActive
                                            ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="text-gray-500" />
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                </NavLink>
                            )}

                            {/* Tooltip */}
                            {!isOpen && (
                                <span className="absolute left-full top-2 ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-40 whitespace-nowrap">
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
                                                `flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150
                                                ${isActive ? 'text-blue-600 bg-blue-50' : ''}`
                                            }
                                        >
                                            <Circle size={10} className="mr-3 text-gray-400" />
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
}
