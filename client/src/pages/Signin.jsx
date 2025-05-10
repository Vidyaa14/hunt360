import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg fade-in">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Sign Up for Hunt360</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <button
                        className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </section>
    );
}