import React from 'react';
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
    X
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const navItems = [
        { to: "/dashboard", icon: Home, label: "Dashboard" },
        { to: "/analytics", icon: BarChart2, label: "Analytics" },
        { to: "/reports", icon: FileText, label: "Reports" },
        { to: "/candidate-hunt", icon: Users, label: "Candidate Hunt" },
        { to: "/job-search", icon: Search, label: "Job Search" },
        { to: "/hr-hunt", icon: Briefcase, label: "HR Hunt" },
        { to: "/profile", icon: User, label: "Profile" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 ease-in-out z-30
            ${isOpen ? 'w-64' : 'w-20'}
            md:relative md:shadow-none
        `}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 overflow-hidden">
                    {isOpen && <img src="/logo.png" alt="Hunt360 Logo" className="h-8 w-auto" />}
                    {isOpen && <span className="text-xl font-bold text-gray-900">Hunt360</span>}
                </div>
                <div className="flex items-center space-x-2 mr-4">
                    <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </div>
            </div>
            <nav className="mt-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <item.icon size={20} className="mr-0 md:mr-3" />
                        {isOpen && <span className="ml-3">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
