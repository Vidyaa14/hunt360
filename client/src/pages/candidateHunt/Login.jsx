/* eslint-disable no-unused-vars */
import { Eye, EyeOff } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = `https://saarthi360-backend.vercel.app/api/candidate`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = useCallback(
        async (e) => {
            e.preventDefault();

            if (!email || !password) {
                setError('Email and password are required.');
                return;
            }

            setError('');
            setLoading(true);

            try {
                const res = await fetch(`${BACKEND_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ email, password }),
                });

                const data = await res.json();

                if (data.success) {
                    window.location.href = '/dashboard';
                } else {
                    setError(data.error || 'Invalid credentials');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        },
        [email, password]
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-[#f7f4fb]">
            <div
                className="md:w-3/5 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: `url(/SignPageBanner.jpg)` }}
                aria-hidden="true"
            ></div>
            <div className="md:w-2/5 flex items-center justify-center p-6">
                <form
                    onSubmit={handleLogin}
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
                    noValidate
                >
                    <img
                        src="/logo.png"
                        alt="AI Candidate Hunt Logo"
                        className="w-24 mx-auto mb-4"
                        aria-hidden="true"
                    />
                    <h2 className="text-3xl font-bold text-[#521c6e] text-center mb-2">
                        AI Candid
                        <span className="italic text-[#8422c2]">ate Hunt</span>
                    </h2>
                    <p className="text-sm text-[#902cce] text-center mb-6">
                        Sign in to Start Your AI-Powered{' '}
                        <span className="italic text-[#9a33d8]">
                            Talent Search!
                        </span>
                    </p>

                    {error && (
                        <div
                            className="bg-red-100 text-red-800 text-sm p-3 rounded-md mb-4 text-center"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 border border-[#6c288d] rounded-md text-sm focus:ring-2 focus:ring-[#7a2494] focus:border-transparent bg-[#f7f4fb] text-[#521c6e]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                            aria-invalid={!!error}
                        />
                    </div>

                    <div className="relative mb-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full p-3 border border-[#6c288d] rounded-md text-sm focus:ring-2 focus:ring-[#7a2494] focus:border-transparent bg-[#f7f4fb] text-[#521c6e]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Password"
                            aria-invalid={!!error}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-[#7a2494]"
                            aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-2/5 mx-auto py-3 bg-[#7a2494] text-white rounded-full font-semibold hover:bg-[#4b2474] disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#7a2494] focus:ring-opacity-50 transition-all duration-200"
                        disabled={loading}
                        aria-label="Sign in"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <Link
                        to="/franchisee-signin"
                        className="ml-12 text-[#7a2494] text-center"
                    >
                        FranchiseeSignin ?
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
