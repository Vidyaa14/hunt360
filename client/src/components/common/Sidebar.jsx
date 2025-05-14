import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    BarChart2,
    FileText,
    Users,
    Search,
    Briefcase,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Circle,
    Building,
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
        { to: '/job-search', icon: Search, label: 'Job Search' },
        { to: '/hr-hunt', icon: Briefcase, label: 'HR Hunt' },
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
                        <img
                            src="/logo.png"
                            alt="Hunt360 Logo"
                            className="h-8 w-auto"
                        />
                    )}
                    {isOpen && (
                        <span className="text-lg font-semibold text-gray-900">
                            Hunt360
                        </span>
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
                {navItems.map((item) => (
                    <div key={item.label}>
                        <div
                            className={`group relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${item.children
                                ? 'text-gray-700 hover:bg-gray-100'
                                : ''
                                }`}
                            onClick={() => item.children && toggleDropdown(item.label)}
                        >
                            {item.children ? (
                                <div className="flex items-center w-full">
                                    <item.icon size={18} className="text-gray-500" />
                                    {isOpen && (
                                        <>
                                            <span className="ml-3 flex-1">{item.label}</span>
                                            <span className="text-gray-400">
                                                {openDropdowns[item.label] ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center w-full px-3 py-2.5 rounded-lg ${isActive
                                            ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <item.icon size={18} className="text-gray-500" />
                                    {isOpen && <span className="ml-3">{item.label}</span>}
                                </NavLink>
                            )}
                            {!isOpen && (
                                <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.label}
                                </span>
                            )}
                        </div>
                        {item.children && openDropdowns[item.label] && isOpen && (
                            <div className="ml-4 mt-1 pb-2 border-l border-gray-200">
                                {item.children.map((child) => (
                                    <NavLink
                                        key={child.to}
                                        to={child.to}
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md ${isActive
                                                ? 'text-blue-600 bg-blue-50'
                                                : ''
                                            }`
                                        }
                                    >
                                        <Circle size={10} className="mr-3 text-gray-400" />
                                        <span className="text-sm">{child.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
