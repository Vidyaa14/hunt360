import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { User, LogOut, ChevronLeft, ChevronRight, Briefcase, Users, Database, BookOpen, Search, Clock } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

// Mock data for charts and recent activity
const mockData = {
    overview: {
        totalJobs: 120,
        hrProfiles: 45,
        corporateLeads: 30,
        campusUsers: 200,
    },
    jobSearch: {
        applications: {
            labels: ['Tech', 'Finance', 'Marketing', 'HR'],
            datasets: [{
                label: 'Applications',
                data: [50, 30, 20, 10],
                backgroundColor: ['#7C3AED', '#F59E0B', '#10B981', '#EF4444'],
            }],
        },
    },
    hrHunt: {
        hiringStatus: {
            labels: ['Hiring Now', 'Not Hiring'],
            datasets: [{
                data: [30, 15],
                backgroundColor: ['#7C3AED', '#D1D5DB'],
            }],
        },
    },
    corporateHunt: {
        dataScraping: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Data Scraped (GB)',
                data: [10, 15, 12, 18, 20],
                borderColor: '#7C3AED',
                fill: false,
            }],
        },
    },
    campus: {
        hrData: {
            labels: ['Students', 'Faculty', 'Alumni'],
            datasets: [{
                data: [100, 50, 50],
                backgroundColor: ['#7C3AED', '#F59E0B', '#10B981'],
            }],
        },
    },
    recentActivity: [
        { id: 1, type: 'Job Application', description: 'Applied to Software Engineer at Amazon', time: '2 hours ago' },
        { id: 2, type: 'HR Profile', description: 'New profile: Jessica Williams', time: '4 hours ago' },
        { id: 3, type: 'Corporate Lead', description: 'Added lead: Meta Inc.', time: 'Yesterday' },
    ],
};

// Top Navbar Component
const TopNavbar = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-20 flex justify-between items-center px-4 sm:px-6 py-3">
            <div className="flex items-center">
                <button
                    className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
                <img src="/logo.png" alt="Hunt360 Logo" className="h-7 sm:h-8 w-auto" />
                <h1 className="ml-2 text-lg sm:text-xl font-semibold text-purple-600">Hunt360</h1>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 pr-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm w-32 sm:w-48"
                    />
                    <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-purple-700 transition-colors">
                    <User size={18} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-600 hidden sm:block">Bankim Doshi</span>
                </div>
                <button
                    className="text-gray-600 hover:text-red-600 transition-colors p-1"
                    onClick={() => navigate('/login')}
                    aria-label="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

// Default Dashboard View Component
const DefaultDashboardView = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Hunt360 Dashboard</h1>

            {/* Overview Section */}
            <section className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex items-center gap-3 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <Briefcase size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Total Jobs</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">{mockData.overview.totalJobs}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex items-center gap-3 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Users size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">HR Profiles</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">{mockData.overview.hrProfiles}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex items-center gap-3 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="bg-green-100 p-2 rounded-full">
                            <Database size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Corporate Leads</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">{mockData.overview.corporateLeads}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex items-center gap-3 hover:shadow-md transition-shadow border border-gray-100">
                        <div className="bg-yellow-100 p-2 rounded-full">
                            <BookOpen size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Campus Users</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800">{mockData.overview.campusUsers}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Job Search Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Job Search Analytics</h2>
                                <button
                                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                                    onClick={() => navigate('/dashboard/jobsearch')}
                                >
                                    View Jobs
                                </button>
                            </div>
                            <div className="h-40 sm:h-48">
                                <Bar
                                    data={mockData.jobSearch.applications}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: false },
                                            tooltip: { enabled: true },
                                        },
                                        scales: {
                                            x: { ticks: { font: { size: 10 } } },
                                            y: { ticks: { font: { size: 10 } } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* HR Hunt Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-700">HR Hunt Profiles</h2>
                                <button
                                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                                    onClick={() => navigate('/dashboard/hr-hunt')}
                                >
                                    Manage Profiles
                                </button>
                            </div>
                            <div className="h-40 sm:h-48">
                                <Pie
                                    data={mockData.hrHunt.hiringStatus}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'right', labels: { font: { size: 10 } } },
                                            title: { display: false },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Corporate Hunt Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Corporate Hunt Data</h2>
                                <button
                                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                                    onClick={() => navigate('/dashboard/corporate')}
                                >
                                    View Data
                                </button>
                            </div>
                            <div className="h-40 sm:h-48">
                                <Line
                                    data={mockData.corporateHunt.dataScraping}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            title: { display: false },
                                        },
                                        scales: {
                                            x: { ticks: { font: { size: 10 } } },
                                            y: { ticks: { font: { size: 10 } } },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Campus Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Campus HR Data</h2>
                                <button
                                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700"
                                    onClick={() => navigate('/dashboard/campus')}
                                >
                                    Manage Campus
                                </button>
                            </div>
                            <div className="h-40 sm:h-48">
                                <Doughnut
                                    data={mockData.campus.hrData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'right', labels: { font: { size: 10 } } },
                                            title: { display: false },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Recent Activity and Settings */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Recent Activity Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Recent Activity</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {mockData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-2">
                                        <Clock size={14} className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-800">{activity.type}</p>
                                            <p className="text-xs text-gray-600">{activity.description}</p>
                                            <p className="text-xs text-gray-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Settings Section */}
                    <section>
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Quick Settings</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">Manage your Hunt360 settings</p>
                            <button
                                className="w-full bg-purple-600 text-white text-sm py-2 rounded-md hover:bg-purple-700 transition-colors"
                                onClick={() => navigate('/settings')}
                            >
                                Go to Settings
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const isRootDashboard = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
                <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 mt-12">
                    {isRootDashboard ? <DefaultDashboardView /> : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
