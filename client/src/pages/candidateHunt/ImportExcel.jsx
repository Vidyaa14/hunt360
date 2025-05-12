/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const BACKEND_URL = 'https://saarthi360-backend.vercel.app/api/candidate';

const ImportExcel = () => {
    const [fileName, setFileName] = useState('No file chosen');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [csvContent, setCsvContent] = useState('');
    const modalRef = useRef(null);
    const firstButtonRef = useRef(null);

    const handleFileChange = useCallback((e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.name.endsWith('.csv')) {
                setFileName(selectedFile.name);
                setFile(selectedFile);
                const reader = new FileReader();
                reader.onload = (event) => setCsvContent(event.target.result);
                reader.readAsText(selectedFile);
                setErrorMsg('');
            } else {
                setErrorMsg('Please select a valid CSV file.');
                setFileName('No file chosen');
                setFile(null);
                setCsvContent('');
            }
        } else {
            setFileName('No file chosen');
            setFile(null);
            setCsvContent('');
        }
    }, []);

    const uploadCSV = useCallback(() => {
        setErrorMsg('');
        setSuccessMsg('');
        if (!file) {
            setErrorMsg('Please select a CSV file to import.');
            return;
        }
        setShowModal(true);
    }, [file]);

    const processUpload = useCallback(async (append) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('csvFile', file);

            const response = await fetch(`${BACKEND_URL}/import?append=${append}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setSuccessMsg(result.message);
                setFile(null);
                setFileName('No file chosen');
                setCsvContent('');
            } else {
                throw new Error(result.error || 'Upload failed.');
            }
        } catch (err) {
            setErrorMsg(err.message || 'An error occurred. Please try again.');
        } finally {
            setShowModal(false);
            setLoading(false);
        }
    }, [file]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setErrorMsg('');
    }, []);

    useEffect(() => {
        if (showModal && firstButtonRef.current) {
            firstButtonRef.current.focus();
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal();
            }
            if (e.key === 'Tab' && showModal) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showModal, handleCloseModal]);

    const displayedFileName = useMemo(() => fileName, [fileName]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow-md animate-fade-in">
                <header className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                    <img
                        src="/logo.png"
                        alt="Talent Corner Logo"
                        className="h-12"
                        aria-hidden="true"
                    />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#54397e] to-[#58096b] bg-clip-text text-transparent">
                        Talent Corner HR Services Pvt. Ltd
                    </h1>
                </header>

                <h2 className="text-4xl font-bold text-[#54397e] mb-4 text-center">
                    Import Excel File
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    Select Excel File (FileType: CSV)
                </p>

                {(errorMsg || successMsg) && (
                    <div
                        className={`p-4 rounded-lg mb-4 ${errorMsg
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                        role="alert"
                        aria-live="polite"
                    >
                        {errorMsg || successMsg}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="file"
                        accept=".csv"
                        id="csvFile"
                        className="hidden"
                        onChange={handleFileChange}
                        aria-label="Upload CSV file"
                    />

                    <button
                        className="w-full px-6 py-3 bg-[#54397e] text-white rounded-full font-semibold hover:bg-[#412d64] focus:ring-2 focus:ring-[#54397e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                        onClick={() => document.getElementById('csvFile').click()}
                        disabled={loading}
                        aria-label="Select CSV file"
                    >
                        Select Excel File
                    </button>

                    <div className="text-gray-600 text-center">{displayedFileName}</div>

                    <button
                        className="w-full px-6 py-3 bg-[#58096b] text-white rounded-full font-semibold hover:bg-[#862799] focus:ring-2 focus:ring-[#58096b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                        onClick={uploadCSV}
                        disabled={loading}
                        aria-label="Import CSV file"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <span className="w-5 h-5 border-4 border-t-[#ffffff] border-gray-200 rounded-full animate-spin mr-2"></span>
                                Uploading...
                            </span>
                        ) : (
                            'Import'
                        )}
                    </button>
                </div>

                {showModal && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Upload options modal"
                    >
                        <div
                            ref={modalRef}
                            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
                        >
                            <p className="text-gray-800 mb-6 text-center">
                                Do you want to append data to existing records or replace them?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    ref={firstButtonRef}
                                    onClick={() => processUpload(true)}
                                    className="px-4 py-2 bg-[#54397e] text-white rounded-full font-semibold hover:bg-[#412d64] focus:ring-2 focus:ring-[#54397e] transition-all duration-200"
                                    aria-label="Append data"
                                >
                                    Append
                                </button>
                                <button
                                    onClick={() => processUpload(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-600 transition-all duration-200"
                                    aria-label="Replace data"
                                >
                                    Replace
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                                    aria-label="Cancel upload"
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
};

ImportExcel.propTypes = {
    // No props needed
};

export default ImportExcel;