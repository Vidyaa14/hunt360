/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const sampleData = {
    headers: [
        'id',
        'name',
        'email',
        'phone',
        'gender',
        'city',
        'college',
        'created_at',
        'token_url',
        'email_sent',
    ],
    rows: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            gender: 'Male',
            city: 'Mumbai',
            college: 'IIT Bombay',
            created_at: '2025-01-01 10:00:00',
            token_url: 'https://example.com/token/1',
            email_sent: 1,
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '234-567-8901',
            gender: 'Female',
            city: 'Delhi',
            college: 'Delhi University',
            created_at: '2025-01-02 12:00:00',
            token_url: 'https://example.com/token/2',
            email_sent: 0,
        },
        {
            id: 3,
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            phone: '345-678-9012',
            gender: 'Female',
            city: 'Bangalore',
            college: 'IISc Bangalore',
            created_at: '2025-01-03 14:00:00',
            token_url: 'https://example.com/token/3',
            email_sent: 1,
        },
        {
            id: 4,
            name: 'Bob Wilson',
            email: 'bob.wilson@example.com',
            phone: '456-789-0123',
            gender: 'Male',
            city: 'Pune',
            college: 'Pune University',
            created_at: '2025-01-04 16:00:00',
            token_url: 'https://example.com/token/4',
            email_sent: 0,
        },
        {
            id: 5,
            name: 'Emily Brown',
            email: 'emily.brown@example.com',
            phone: '567-890-1234',
            gender: 'Female',
            city: 'Chennai',
            college: 'Anna University',
            created_at: '2025-01-05 18:00:00',
            token_url: 'https://example.com/token/5',
            email_sent: 1,
        },
        {
            id: 6,
            name: 'Michael Lee',
            email: 'michael.lee@example.com',
            phone: '678-901-2345',
            gender: 'Male',
            city: 'Hyderabad',
            college: 'IIIT Hyderabad',
            created_at: '2025-01-06 20:00:00',
            token_url: 'https://example.com/token/6',
            email_sent: 0,
        },
        {
            id: 7,
            name: 'Sarah Davis',
            email: 'sarah.davis@example.com',
            phone: '789-012-3456',
            gender: 'Female',
            city: 'Mumbai',
            college: 'IIT Bombay',
            created_at: '2025-01-07 22:00:00',
            token_url: 'https://example.com/token/7',
            email_sent: 1,
        },
        {
            id: 8,
            name: 'David Martinez',
            email: 'david.martinez@example.com',
            phone: '890-123-4567',
            gender: 'Male',
            city: 'Delhi',
            college: 'Delhi University',
            created_at: '2025-01-08 09:00:00',
            token_url: 'https://example.com/token/8',
            email_sent: 0,
        },
        {
            id: 9,
            name: 'Laura Garcia',
            email: 'laura.garcia@example.com',
            phone: '901-234-5678',
            gender: 'Female',
            city: 'Bangalore',
            college: 'IISc Bangalore',
            created_at: '2025-01-09 11:00:00',
            token_url: 'https://example.com/token/9',
            email_sent: 1,
        },
        {
            id: 10,
            name: 'James Rodriguez',
            email: 'james.rodriguez@example.com',
            phone: '012-345-6789',
            gender: 'Male',
            city: 'Pune',
            college: 'Pune University',
            created_at: '2025-01-10 13:00:00',
            token_url: 'https://example.com/token/10',
            email_sent: 0,
        },
    ],
};

const headerMapping = {
    id: 'ID',
    name: 'Name',
    email: 'Email',
    phone: 'Contact Number',
    gender: 'Gender',
    city: 'City',
    college: 'College',
    created_at: 'Created At',
    token_url: 'Token URL',
};

function formatHeader(header) {
    return header
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function FDFormData() {
    const [currentData, setCurrentData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState(null);
    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [modifyData, setModifyData] = useState({});
    const [originalEmail, setOriginalEmail] = useState('');

    const ROWS_PER_PAGE = 50;

    useEffect(() => {
        loadData(false);
        const interval = setInterval(() => loadData(true), 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = useCallback((showSpinner = true) => {
        if (showSpinner) setProcessing(true);
        setTimeout(() => {
            setCurrentData(sampleData);
            setProcessing(false);
            setSelectedRecords([]);
        }, 1000);
    }, []);

    const showMessage = useCallback((text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    }, []);

    const toggleRecordSelection = useCallback((id) => {
        setSelectedRecords((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    }, []);

    const handleSelectAll = useCallback(
        (checked) => {
            if (checked) {
                const allIds = currentData?.rows.map((row) => row.id) || [];
                setSelectedRecords(allIds);
            } else {
                setSelectedRecords([]);
            }
        },
        [currentData]
    );

    const openModifyModal = useCallback((row) => {
        setModifyData(row);
        setOriginalEmail(row.email);
        setModifyModalOpen(true);
    }, []);

    const confirmModify = useCallback(() => {
        setProcessing(true);
        setTimeout(() => {
            const updatedRows = currentData.rows.map((row) =>
                row.id === modifyData.id
                    ? {
                          ...modifyData,
                          email_sent:
                              modifyData.email !== originalEmail
                                  ? 0
                                  : row.email_sent,
                      }
                    : row
            );
            setCurrentData({ ...currentData, rows: updatedRows });
            setProcessing(false);
            setModifyModalOpen(false);
            showMessage('Record modified successfully', 'success');
        }, 500);
    }, [currentData, modifyData, originalEmail, showMessage]);

    const triggerSendEmail = useCallback(() => {
        setProcessing(true);
        setTimeout(() => {
            const updatedRows = currentData.rows.map((row) => ({
                ...row,
                email_sent: 1,
            }));
            setCurrentData({ ...currentData, rows: updatedRows });
            setProcessing(false);
            showMessage('Emails sent successfully', 'success');
        }, 500);
    }, [currentData, showMessage]);

    const triggerDeleteSelected = useCallback(() => {
        if (selectedRecords.length === 0) {
            showMessage('No rows selected.', 'error');
            return;
        }
        setConfirmDeleteModalOpen(true);
    }, [selectedRecords, showMessage]);

    const confirmDeleteSelected = useCallback(() => {
        setProcessing(true);
        setTimeout(() => {
            const updatedRows = currentData.rows.filter(
                (row) => !selectedRecords.includes(row.id)
            );
            setCurrentData({ ...currentData, rows: updatedRows });
            setProcessing(false);
            setConfirmDeleteModalOpen(false);
            setSelectedRecords([]);
            showMessage('Selected records deleted successfully', 'success');
        }, 500);
    }, [currentData, selectedRecords, showMessage]);

    const triggerDeleteAll = useCallback(() => {
        setDeleteAllModalOpen(true);
    }, []);

    const confirmDeleteAll = useCallback(() => {
        setProcessing(true);
        setTimeout(() => {
            setCurrentData({ ...currentData, rows: [] });
            setProcessing(false);
            setDeleteAllModalOpen(false);
            setSelectedRecords([]);
            showMessage('All records deleted successfully', 'success');
        }, 500);
    }, [currentData, showMessage]);

    const paginatedRows = useMemo(() => {
        return (
            currentData?.rows?.slice(
                (currentPage - 1) * ROWS_PER_PAGE,
                currentPage * ROWS_PER_PAGE
            ) || []
        );
    }, [currentData, currentPage]);

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-6 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src="/logo.png"
                        alt="Talent Corner Logo"
                        className="h-12"
                        aria-hidden="true"
                    />
                    <h1 className="text-3xl font-bold text-[#54397e] bg-gradient-to-r from-[#54397e] to-[#432c65] bg-clip-text">
                        Candidate Details
                    </h1>
                </div>

                {/* Messages */}
                {message && (
                    <div
                        className={`p-4 rounded-lg text-center font-bold ${
                            message.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}

                {processing && (
                    <div className="flex justify-center items-center my-4">
                        <div className="w-5 h-5 border-4 border-t-[#54397e] border-gray-200 rounded-full animate-spin mr-2"></div>
                        <span className="text-gray-600">
                            Processing, please wait...
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
                    <div className="flex gap-4">
                        <div className="flex items-center bg-white border-l-4 border-[#54397e] p-4 rounded-lg shadow-md">
                            <div className="w-10 h-10 bg-[#f0ebf8] text-[#54397e] flex items-center justify-center rounded-full mr-4 text-xl">
                                👤
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    Total Users
                                </div>
                                <div className="text-xl font-bold text-[#54397e]">
                                    {currentData?.rows?.length || 0}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center bg-white border-l-4 border-[#54397e] p-4 rounded-lg shadow-md">
                            <div className="w-10 h-10 bg-[#f0ebf8] text-[#54397e] flex items-center justify-center rounded-full mr-4 text-xl">
                                ✉️
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    Email Sent
                                </div>
                                <div className="text-xl font-bold text-[#54397e]">
                                    {currentData?.rows?.filter(
                                        (r) => r.email_sent === 1
                                    )?.length || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    {currentData?.rows?.length ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#54397e] to-[#432c65] text-white">
                                    <th className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#54397e] to-[#432c65]">
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked
                                                )
                                            }
                                            checked={
                                                selectedRecords.length ===
                                                currentData.rows.length
                                            }
                                            aria-label="Select all records"
                                        />
                                    </th>
                                    {currentData.headers
                                        .filter(
                                            (h) =>
                                                h.toLowerCase() !== 'email_sent'
                                        )
                                        .map((header) => (
                                            <th
                                                key={header}
                                                className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#54397e] to-[#432c65]"
                                                scope="col"
                                            >
                                                {headerMapping[
                                                    header.toLowerCase()
                                                ] || formatHeader(header)}
                                            </th>
                                        ))}
                                    <th className="p-3 text-left text-sm font-bold sticky top-0 right-0 bg-gradient-to-r from-[#54397e] to-[#432c65]">
                                        Email Status
                                    </th>
                                    <th className="p-3 text-left text-sm font-bold sticky top-0 right-0 bg-gradient-to-r from-[#54397e] to-[#432c65] shadow-md">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecords.includes(
                                                    row.id
                                                )}
                                                onChange={() =>
                                                    toggleRecordSelection(
                                                        row.id
                                                    )
                                                }
                                                aria-label={`Select record for ${row.name}`}
                                            />
                                        </td>
                                        {currentData.headers
                                            .filter(
                                                (h) =>
                                                    h.toLowerCase() !==
                                                    'email_sent'
                                            )
                                            .map((header) => (
                                                <td
                                                    key={header}
                                                    className="p-3 text-sm text-gray-700"
                                                >
                                                    {row[
                                                        header.toLowerCase()
                                                    ] || ''}
                                                </td>
                                            ))}
                                        <td className="p-3 text-sm sticky right-0 bg-white">
                                            <span
                                                className={
                                                    row.email_sent
                                                        ? 'text-green-600 font-bold'
                                                        : 'text-orange-600'
                                                }
                                            >
                                                {row.email_sent
                                                    ? 'Sent'
                                                    : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm sticky right-0 bg-white shadow-md">
                                            <button
                                                className="px-3 py-1 bg-[#54397e] text-white rounded-full text-sm font-semibold hover:bg-[#432c65] focus:ring-2 focus:ring-[#54397e] transition-all duration-200"
                                                onClick={() =>
                                                    openModifyModal(row)
                                                }
                                                aria-label={`Modify record for ${row.name}`}
                                            >
                                                Modify
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-600 font-bold py-4">
                            No data available.
                        </div>
                    )}
                </div>

                {currentData?.rows?.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 bg-[#54397e] text-white rounded-lg font-semibold hover:bg-[#432c65] disabled:bg-gray-400 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {currentPage} of{' '}
                            {Math.ceil(currentData.rows.length / ROWS_PER_PAGE)}
                        </span>
                        <button
                            disabled={
                                currentPage >=
                                Math.ceil(
                                    currentData.rows.length / ROWS_PER_PAGE
                                )
                            }
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 bg-[#54397e] text-white rounded-lg font-semibold hover:bg-[#432c65] disabled:bg-gray-400 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Email Section */}
                {currentData?.rows?.length > 0 && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={triggerSendEmail}
                            className="px-4 py-2 bg-[#54397e] text-white rounded-full font-semibold hover:bg-[#432c65] focus:ring-2 focus:ring-[#54397e] transition-all duration-200"
                            aria-label="Send email to all candidates"
                        >
                            Send Email
                        </button>
                        <button
                            onClick={triggerDeleteSelected}
                            className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                            aria-label="Delete selected records"
                        >
                            Delete Selected
                        </button>
                        <button
                            onClick={triggerDeleteAll}
                            className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                            aria-label="Delete all records"
                        >
                            Delete All
                        </button>
                    </div>
                )}

                {/* Modify Modal */}
                {modifyModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-[#54397e] text-xl"
                                onClick={() => setModifyModalOpen(false)}
                                aria-label="Close modify modal"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-bold text-[#54397e] mb-4">
                                Modify Record
                            </h3>
                            <input
                                type="text"
                                value={modifyData.name || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Name"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="Name"
                            />
                            <input
                                type="text"
                                value={modifyData.email || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="Email"
                            />
                            <input
                                type="text"
                                value={modifyData.phone || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Phone"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="Phone"
                            />
                            <input
                                type="text"
                                value={modifyData.gender || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        gender: e.target.value,
                                    })
                                }
                                placeholder="Gender"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="Gender"
                            />
                            <input
                                type="text"
                                value={modifyData.city || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        city: e.target.value,
                                    })
                                }
                                placeholder="City"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="City"
                            />
                            <input
                                type="text"
                                value={modifyData.college || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        college: e.target.value,
                                    })
                                }
                                placeholder="College"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="College"
                            />
                            <input
                                type="text"
                                value={modifyData.token_url || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        token_url: e.target.value,
                                    })
                                }
                                placeholder="Token URL"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#54397e]"
                                aria-label="Token URL"
                            />
                            <button
                                className="px-4 py-2 bg-[#54397e] text-white rounded-full font-semibold hover:bg-[#432c65] focus:ring-2 focus:ring-[#54397e]"
                                onClick={confirmModify}
                                aria-label="Save changes"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirm Delete Modal */}
                {confirmDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-[#54397e] text-xl"
                                onClick={() => setConfirmDeleteModalOpen(false)}
                                aria-label="Close delete modal"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-bold text-[#54397e] mb-4">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Do you want to delete the selected records?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                                    onClick={confirmDeleteSelected}
                                    aria-label="Confirm delete selected records"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 focus:ring-2 focus:ring-gray-300"
                                    onClick={() =>
                                        setConfirmDeleteModalOpen(false)
                                    }
                                    aria-label="Cancel deletion"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete All Modal */}
                {deleteAllModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-[#54397e] text-xl"
                                onClick={() => setDeleteAllModalOpen(false)}
                                aria-label="Close delete all modal"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-bold text-[#54397e] mb-4">
                                Confirm Delete All
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete all data?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                                    onClick={confirmDeleteAll}
                                    aria-label="Confirm delete all records"
                                >
                                    Yes, Delete All
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setDeleteAllModalOpen(false)}
                                    aria-label="Cancel delete all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

FDFormData.propTypes = {};

export default FDFormData;
