/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MailIcon } from 'lucide-react';

const mockData = {
    headers: [
        'id',
        'full name',
        'email',
        'phone no',
        'token_url',
        'email_sent',
    ],
    rows: [
        {
            id: 1,
            'full name': 'John Doe',
            email: 'john@example.com',
            'phone no': '1234567890',
            token_url: 'http://localhost:3000/form?token=123',
            email_sent: 1,
        },
        {
            id: 2,
            'full name': 'Jane Smith',
            email: 'jane@example.com',
            'phone no': '0987654321',
            token_url: '',
            email_sent: 0,
        },
    ],
};

const ImportedData = () => {
    const [data, setData] = useState({ headers: [], rows: [] });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData(mockData);
            setLoading(false);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load data' });
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCheckboxChange = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const handleSendEmail = useCallback(async () => {
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Emails sent successfully' });
            setData((prev) => ({
                ...prev,
                rows: prev.rows.map((row) => ({ ...row, email_sent: 1 })),
            }));
        } catch (err) {
            setMessage({ type: 'error', text: 'Email sending failed' });
        }
    }, []);

    const handleDeleteSelected = useCallback(async () => {
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData((prev) => ({
                ...prev,
                rows: prev.rows.filter((row) => !selectedIds.includes(row.id)),
            }));
            setSelectedIds([]);
            setMessage({
                type: 'success',
                text: 'Selected records deleted successfully',
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Delete failed' });
        }
    }, [selectedIds]);

    const handleDeleteAll = useCallback(async () => {
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData({ headers: [], rows: [] });
            setSelectedIds([]);
            setMessage({
                type: 'success',
                text: 'All records deleted successfully',
            });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete all data' });
        }
    }, []);

    const totalUsers = useMemo(() => data.rows.length, [data.rows]);
    const emailsSent = useMemo(
        () => data.rows.filter((r) => r.email_sent === 1).length,
        [data.rows]
    );

    return (
        <div className="max-w-7xl mx-auto p-8 min-h-screen animate-fade-in">
            <header className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <img
                    src="/logo.png"
                    alt="Talent Corner Logo"
                    className="h-12"
                    aria-hidden="true"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4c277a] to-[#6a1b9a] bg-clip-text text-transparent">
                    Talent Corner HR Services Pvt. Ltd
                </h1>
            </header>

            <h2 className="text-3xl font-bold text-[#4c277a] mb-6">
                Imported Candidate Data
            </h2>

            <div className="flex gap-4 mb-6 justify-end">
                <div className="bg-white rounded-lg shadow-md p-6 flex-1 max-w-xs">
                    <div className="text-gray-500 font-semibold text-sm">
                        👤 Total Users
                    </div>
                    <div className="text-2xl font-bold text-[#4c277a]">
                        {totalUsers}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex-1 max-w-xs">
                    <div className="text-gray-500 font-semibold text-sm flex flex-row items-center">
                        <MailIcon /> &nbsp; Email Sent
                    </div>
                    <div className="text-2xl font-bold text-[#4c277a]">
                        {emailsSent}
                    </div>
                </div>
            </div>

            {message.text && (
                <div
                    className={`p-4 rounded-lg mb-4 ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                    role="alert"
                    aria-live="polite"
                >
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="w-8 h-8 border-4 border-t-[#4c277a] border-gray-200 rounded-full animate-spin mr-2"></span>
                    Loading...
                </div>
            ) : (
                <>
                    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#4c277a] text-white font-semibold">
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            <input
                                                type="checkbox"
                                                aria-label="Select all rows"
                                                onChange={(e) =>
                                                    setSelectedIds(
                                                        e.target.checked
                                                            ? data.rows.map(
                                                                  (row) =>
                                                                      row.id
                                                              )
                                                            : []
                                                    )
                                                }
                                                checked={
                                                    selectedIds.length ===
                                                        data.rows.length &&
                                                    data.rows.length > 0
                                                }
                                            />
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            ID
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Full Name
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Email
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Phone No
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Token URL
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Email Status
                                        </th>
                                        <th
                                            className="p-4 text-left"
                                            scope="col"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.rows.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            className={
                                                index % 2 === 0
                                                    ? 'bg-gray-50'
                                                    : 'bg-white'
                                            }
                                        >
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        row.id
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            row.id
                                                        )
                                                    }
                                                    aria-label={`Select row for ${row['full name']}`}
                                                />
                                            </td>
                                            <td className="p-4">{row.id}</td>
                                            <td className="p-4">
                                                {row['full name']}
                                            </td>
                                            <td className="p-4">{row.email}</td>
                                            <td className="p-4">
                                                {row['phone no']}
                                            </td>
                                            <td className="p-4">
                                                {row.token_url || '-'}
                                            </td>
                                            <td className="p-4">
                                                {row.email_sent ? (
                                                    <span className="text-green-600 font-bold">
                                                        Sent
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-600 font-bold">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    className="px-4 py-2 bg-[#4c277a] text-white rounded-full hover:bg-[#6a1b9a] transition-all duration-200"
                                                    aria-label={`Modify record for ${row['full name']}`}
                                                    disabled
                                                >
                                                    Modify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full cursor-not-allowed"
                            disabled
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-gray-700">
                            Page 1 of 1
                        </span>
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full cursor-not-allowed"
                            disabled
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleSendEmail}
                            className="px-6 py-3 bg-[#4c277a] text-white rounded-full font-semibold hover:bg-[#6a1b9a] focus:ring-2 focus:ring-[#4c277a] transition-all duration-200"
                            aria-label="Send emails to candidates"
                        >
                            Send Email
                        </button>
                        <button
                            onClick={handleDeleteSelected}
                            className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                            disabled={selectedIds.length === 0}
                            aria-label="Delete selected records"
                        >
                            Delete Selected
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                            disabled={data.rows.length === 0}
                            aria-label="Delete all records"
                        >
                            Delete All
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

ImportedData.propTypes = {
    // No props needed
};

export default ImportedData;
