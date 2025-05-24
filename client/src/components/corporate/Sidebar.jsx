import {
    FaBroom,
    FaBullhorn,
    FaDatabase,
    FaEdit,
    FaFileAlt,
    FaTachometerAlt,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
    const navItems = [
        { to: '/', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: '/data-scraping', icon: <FaDatabase />, label: 'Data Scraping' },
        {
            to: '/bulk-data-cleaning',
            icon: <FaBroom />,
            label: 'Bulk Data Cleaning',
        },
        {
            to: '/single-data-edit',
            icon: <FaEdit />,
            label: 'Single Data Edit',
        },
        {
            to: '/marketing-data',
            icon: <FaBullhorn />,
            label: 'Marketing Data',
        },
        { to: '/reports', icon: <FaFileAlt />, label: 'Reports' },
    ];

    return (
        <div
            className={`fixed top-[60px] sm:top-[70px] left-0 bottom-0 w-[200px] sm:w-[250px] md:w-[250px] bg-white p-4 sm:p-5 overflow-y-auto shadow-lg z-40 transition-transform duration-300 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } sm:translate-x-0`}
        >
            <div className="flex justify-between items-center mb-3 sm:mb-4 sm:hidden">
                <h4 className="text-base font-bold text-gray-800">
                    Corporate Management
                </h4>
                <button
                    onClick={toggleSidebar}
                    className="text-gray-600 hover:text-gray-800 text-xl"
                    aria-label="Close sidebar"
                >
                    ✕
                </button>
            </div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800 hidden sm:block">
                Corporate Management
            </h4>
            <ul className="list-none p-0 m-0">
                {navItems.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 sm:gap-3 py-2 sm:py-3 pl-3 sm:pl-4 text-sm sm:text-base transition-colors duration-300 no-underline w-full ${
                                    isActive
                                        ? 'bg-purple-600 text-white rounded-lg'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-purple-100'
                                }`
                            }
                        >
                            <span className="text-lg sm:text-xl">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
