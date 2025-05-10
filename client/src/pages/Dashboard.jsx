import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    Home,
    BarChart2,
    FileText,
    User,
    Settings,
    Menu,
    X
} from 'lucide-react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 md:shadow-none
      `}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <img src="/logo.png" alt="Hunt360 Logo" className="h-8 w-auto" />
                        <span className="text-xl font-bold text-gray-900">Hunt360</span>
                    </div>
                    <button
                        className="md:hidden text-gray-600 hover:text-gray-900"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-6">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <Home size={20} className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <BarChart2 size={20} className="mr-3" />
                        Analytics
                    </NavLink>
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <FileText size={20} className="mr-3" />
                        Reports
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <User size={20} className="mr-3" />
                        Profile
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 text-sm font-semibold transition-colors duration-200 ${isActive
                                ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`
                        }
                    >
                        <Settings size={20} className="mr-3" />
                        Settings
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white shadow-md sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <button
                                    className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Menu size={24} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                                    />
                                    <svg
                                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <User size={24} className="text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">User Name</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Sample Dashboard Card */}
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Overview</h3>
                                <p className="text-gray-600">Monitor real-time data aggregation from online communities.</p>
                                <Link
                                    to="/analytics"
                                    className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Reports</h3>
                                <p className="text-gray-600">Access your latest analytical reports and insights.</p>
                                <Link
                                    to="/reports"
                                    className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    View Reports
                                </Link>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                                <p className="text-gray-600">Customize your dashboard and data preferences.</p>
                                <Link
                                    to="/settings"
                                    className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    Configure
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}