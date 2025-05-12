import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const BACKEND_URL = `https://saarthi360-backend.vercel.app/api/candidate`;

const AdminLoginData = ({ isSidebarCollapsed = false }) => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${BACKEND_URL}/admin-logindata`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setRows(result.rows || []);
        } catch (err) {
            console.error('Failed to load data', err);
            setError('Failed to load admin login data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : ''
                    }`}
            >
                <h1 className="text-3xl font-bold text-[#55208d] mb-6">Admin Login Data</h1>
                <div className="bg-white rounded-lg p-6 shadow-md overflow-x-auto">
                    {loading ? (
                        <p className="text-gray-600 text-center" role="status">
                            Loading data...
                        </p>
                    ) : error ? (
                        <p
                            className="bg-red-100 text-red-800 p-3 rounded-md text-center"
                            role="alert"
                        >
                            {error}
                        </p>
                    ) : rows.length === 0 ? (
                        <p className="text-gray-600 text-center" role="status">
                            No data found.
                        </p>
                    ) : (
                        <table
                            className="w-full border-collapse text-left"
                            aria-label="Admin login data table"
                        >
                            <thead>
                                <tr className="bg-[#55208d] text-white">
                                    <th className="p-3 text-sm font-semibold">Admin Email</th>
                                    <th className="p-3 text-sm font-semibold">Login Time</th>
                                    <th className="p-3 text-sm font-semibold">Logout Time</th>
                                    <th className="p-3 text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="p-3 text-sm text-gray-800 truncate">
                                            {row.email || '—'}
                                        </td>
                                        <td className="p-3 text-sm text-gray-800">
                                            {row.login_time || '—'}
                                        </td>
                                        <td className="p-3 text-sm text-gray-800">
                                            {row.logout_time || '—'}
                                        </td>
                                        <td className="p-3 text-sm flex items-center">
                                            <span
                                                className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${row.status === 'Online'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500'
                                                    }`}
                                                aria-hidden="true"
                                            ></span>
                                            <span
                                                className={
                                                    row.status === 'Online'
                                                        ? 'text-green-600 font-semibold'
                                                        : 'text-red-600 font-semibold'
                                                }
                                            >
                                                {row.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

AdminLoginData.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

AdminLoginData.defaultProps = {
    isSidebarCollapsed: false,
};

export default AdminLoginData;