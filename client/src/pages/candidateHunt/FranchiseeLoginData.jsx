/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const sampleData = [
    {
        id: 1,
        Email: 'franchise1@example.com',
        Password: 'pass123',
        'Organization name': 'TechCorp',
        Timestamp: '2025-01-01 10:00:00',
        Otp: '123456',
    },
    {
        id: 2,
        Email: 'franchise2@example.com',
        Password: 'pass456',
        'Organization name': 'HealthInc',
        Timestamp: '2025-01-02 12:00:00',
        Otp: '654321',
    },
    {
        id: 3,
        Email: 'franchise3@example.com',
        Password: 'pass789',
        'Organization name': 'EduOrg',
        Timestamp: '2025-01-03 14:00:00',
        Otp: '987654',
    },
    {
        id: 4,
        Email: 'franchise4@example.com',
        Password: 'pass101',
        'Organization name': 'FinCorp',
        Timestamp: '2025-01-04 16:00:00',
        Otp: '456789',
    },
    {
        id: 5,
        Email: 'franchise5@example.com',
        Password: 'pass202',
        'Organization name': 'RetailCo',
        Timestamp: '2025-01-05 18:00:00',
        Otp: '321654',
    },
    {
        id: 6,
        Email: 'franchise6@example.com',
        Password: 'pass303',
        'Organization name': 'TechCorp',
        Timestamp: '2025-01-06 20:00:00',
        Otp: '789123',
    },
    {
        id: 7,
        Email: 'franchise7@example.com',
        Password: 'pass404',
        'Organization name': 'HealthInc',
        Timestamp: '2025-01-07 22:00:00',
        Otp: '147258',
    },
    {
        id: 8,
        Email: 'franchise8@example.com',
        Password: 'pass505',
        'Organization name': 'EduOrg',
        Timestamp: '2025-01-08 09:00:00',
        Otp: '369852',
    },
    {
        id: 9,
        Email: 'franchise9@example.com',
        Password: 'pass606',
        'Organization name': 'FinCorp',
        Timestamp: '2025-01-09 11:00:00',
        Otp: '258147',
    },
    {
        id: 10,
        Email: 'franchise10@example.com',
        Password: 'pass707',
        'Organization name': 'RetailCo',
        Timestamp: '2025-01-10 13:00:00',
        Otp: '741852',
    },
];

const FranchiseLoginData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const [modifyData, setModifyData] = useState({});

    const rowsPerPage = 50;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setData(sampleData);
            setLoading(false);
            setSelectedIds([]);
        }, 1000);
    }, []);

    const handleCheckboxChange = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    }, []);

    const currentRows = useMemo(() => {
        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        return data.slice(indexOfFirstRow, indexOfLastRow);
    }, [data, currentPage]);

    const handleSelectAll = useCallback(
        (e) => {
            if (e.target.checked) {
                setSelectedIds(currentRows.map((row) => row.id));
            } else {
                setSelectedIds([]);
            }
        },
        [currentRows]
    );

    const handleDeleteSelected = useCallback(() => {
        if (selectedIds.length === 0) return;
        if (
            !window.confirm(
                `Are you sure you want to delete ${selectedIds.length} selected users?`
            )
        )
            return;
        setTimeout(() => {
            setData((prev) =>
                prev.filter((row) => !selectedIds.includes(row.id))
            );
            setSelectedIds([]);
            alert('Selected users deleted successfully!');
        }, 500);
    }, [selectedIds]);

    const handleDeleteAll = useCallback(() => {
        if (
            !window.confirm(
                'Are you sure you want to delete ALL franchise users?'
            )
        )
            return;
        setTimeout(() => {
            setData([]);
            setSelectedIds([]);
            alert('All users deleted successfully!');
        }, 500);
    }, []);

    const openModifyModal = useCallback((row) => {
        setModifyData(row);
        setModifyModalOpen(true);
    }, []);

    const confirmModify = useCallback(() => {
        setTimeout(() => {
            setData((prev) =>
                prev.map((row) => (row.id === modifyData.id ? modifyData : row))
            );
            setModifyModalOpen(false);
            alert('User modified successfully!');
        }, 500);
    }, [modifyData]);

    const openAddUserModal = useCallback(() => {
        setModifyData({
            id: data.length + 1,
            Email: '',
            Password: '',
            'Organization name': '',
            Timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            Otp: '',
        });
        setAddUserModalOpen(true);
    }, [data]);

    const confirmAddUser = useCallback(() => {
        setTimeout(() => {
            setData((prev) => [...prev, modifyData]);
            setAddUserModalOpen(false);
            alert('User added successfully!');
        }, 500);
    }, [modifyData]);

    const paginate = useCallback(
        (pageNumber) => setCurrentPage(pageNumber),
        []
    );

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto p-6 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src="/logo.png"
                        alt="Talent Corner Logo"
                        className="h-12"
                        aria-hidden="true"
                    />
                    <h1 className="text-3xl font-bold text-[#5e239d] bg-gradient-to-r from-[#5e239d] to-[#6b21a8] bg-clip-text">
                        Franchise Login Data
                    </h1>
                </div>

                {error && (
                    <div
                        className="p-4 bg-red-100 text-red-700 rounded-lg text-center font-bold mb-4"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
                    <div className="flex items-center bg-white border-l-4 border-[#5e239d] p-4 rounded-lg shadow-md">
                        <div className="w-10 h-10 bg-[#f3e5f5] text-[#5e239d] flex items-center justify-center rounded-full mr-4 text-xl">
                            👤
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">
                                Total Users
                            </div>
                            <div className="text-xl font-bold text-[#5e239d]">
                                {data.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#5e239d] to-[#6b21a8] text-white">
                                <th className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            selectedIds.length ===
                                                currentRows.length &&
                                            currentRows.length > 0
                                        }
                                        aria-label="Select all users"
                                    />
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    ID
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    Email
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    Password
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    Organization
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    Timestamp
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    OTP
                                </th>
                                <th
                                    className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#6b21a8]"
                                    scope="col"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="p-4 text-center text-gray-600 font-bold"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentRows.length > 0 ? (
                                currentRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    row.id
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(row.id)
                                                }
                                                aria-label={`Select user ${row.Email}`}
                                            />
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row.id}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row.Email}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row.Password ? '*****' : ''}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row['Organization name']}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row.Timestamp}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {row.Otp}
                                        </td>
                                        <td className="p-3 text-sm">
                                            <button
                                                className="px-3 py-1 bg-[#5e239d] text-white rounded-full text-sm font-semibold hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#5e239d] transition-all duration-200"
                                                onClick={() =>
                                                    openModifyModal(row)
                                                }
                                                aria-label={`Modify user ${row.Email}`}
                                            >
                                                Modify
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="p-4 text-center text-gray-600 font-bold"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-[#5e239d] text-white rounded-lg font-semibold hover:bg-[#6b21a8] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">
                        Page {currentPage} of{' '}
                        {Math.max(1, Math.ceil(data.length / rowsPerPage))}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                            currentPage >= Math.ceil(data.length / rowsPerPage)
                        }
                        className="px-4 py-2 bg-[#5e239d] text-white rounded-lg font-semibold hover:bg-[#6b21a8] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={openAddUserModal}
                        className="px-4 py-2 bg-[#5e239d] text-white rounded-full font-semibold hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#5e239d] transition-all duration-200"
                        aria-label="Add new user"
                    >
                        Add User
                    </button>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedIds.length === 0}
                        className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-600 transition-all duration-200"
                        aria-label="Delete selected users"
                    >
                        Delete Selected
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                        aria-label="Delete all users"
                    >
                        Delete All
                    </button>
                </div>

                {/* Modify Modal */}
                {modifyModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-[#5e239d] text-xl"
                                onClick={() => setModifyModalOpen(false)}
                                aria-label="Close modify modal"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-bold text-[#5e239d] mb-4">
                                Modify User
                            </h3>
                            <input
                                type="text"
                                value={modifyData.Email || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Email"
                            />
                            <input
                                type="text"
                                value={modifyData.Password || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Password: e.target.value,
                                    })
                                }
                                placeholder="Password"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Password"
                            />
                            <input
                                type="text"
                                value={modifyData['Organization name'] || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        'Organization name': e.target.value,
                                    })
                                }
                                placeholder="Organization Name"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Organization Name"
                            />
                            <input
                                type="text"
                                value={modifyData.Timestamp || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Timestamp: e.target.value,
                                    })
                                }
                                placeholder="Timestamp"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Timestamp"
                            />
                            <input
                                type="text"
                                value={modifyData.Otp || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Otp: e.target.value,
                                    })
                                }
                                placeholder="OTP"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="OTP"
                            />
                            <button
                                className="px-4 py-2 bg-[#5e239d] text-white rounded-full font-semibold hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#5e239d]"
                                onClick={confirmModify}
                                aria-label="Save changes"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* Add User Modal */}
                {addUserModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-[#5e239d] text-xl"
                                onClick={() => setAddUserModalOpen(false)}
                                aria-label="Close add user modal"
                            >
                                ×
                            </button>
                            <h3 className="text-lg font-bold text-[#5e239d] mb-4">
                                Add User
                            </h3>
                            <input
                                type="text"
                                value={modifyData.Email || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Email: e.target.value,
                                    })
                                }
                                placeholder="Email"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Email"
                            />
                            <input
                                type="text"
                                value={modifyData.Password || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Password: e.target.value,
                                    })
                                }
                                placeholder="Password"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Password"
                            />
                            <input
                                type="text"
                                value={modifyData['Organization name'] || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        'Organization name': e.target.value,
                                    })
                                }
                                placeholder="Organization Name"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Organization Name"
                            />
                            <input
                                type="text"
                                value={modifyData.Timestamp || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Timestamp: e.target.value,
                                    })
                                }
                                placeholder="Timestamp"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="Timestamp"
                            />
                            <input
                                type="text"
                                value={modifyData.Otp || ''}
                                onChange={(e) =>
                                    setModifyData({
                                        ...modifyData,
                                        Otp: e.target.value,
                                    })
                                }
                                placeholder="OTP"
                                className="w-full p-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e239d]"
                                aria-label="OTP"
                            />
                            <button
                                className="px-4 py-2 bg-[#5e239d] text-white rounded-full font-semibold hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#5e239d]"
                                onClick={confirmAddUser}
                                aria-label="Add user"
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

FranchiseLoginData.propTypes = {
    // No props needed
};

export default FranchiseLoginData;
