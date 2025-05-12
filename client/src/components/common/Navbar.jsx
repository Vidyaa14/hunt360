import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-lg fixed w-full z-20 top-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="Hunt360 Logo"
                            className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                        />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Hunt360</span>
                    </div>
                    <div className="flex items-center space-x-8">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-gray-700 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 
                ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="#features"
                            className={({ isActive }) =>
                                `text-gray-700 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 
                ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            Features
                        </NavLink>
                        <NavLink
                            to="#about"
                            className={({ isActive }) =>
                                `text-gray-700 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 
                ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `text-gray-700 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 
                ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            Login
                        </NavLink>
                        <Link
                            to="/signup"
                            className="bg-blue-600 text-white text-sm font-semibold uppercase tracking-wide px-5 py-2.5 rounded-lg 
                hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}