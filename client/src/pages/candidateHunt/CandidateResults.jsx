import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const BACKEND_URL = 'https://saarthi360-backend.vercel.app/api/candidate';

const CandidateResults = () => {
    const location = useLocation();
    const { domain, subDomain } = location.state || {};
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (domain && subDomain) {
            const fetchCandidates = async () => {
                try {
                    const response = await fetch(
                        `${BACKEND_URL}/filterCandidates`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ domain, subDomain }),
                        }
                    );

                    const data = await response.json();

                    if (data.success) {
                        setCandidates(data.data || []);
                    } else {
                        setError(data.error || 'No candidates found.');
                    }
                } catch (err) {
                    setError('Failed to fetch candidates. Please try again.');
                    console.error('Fetch candidates error:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchCandidates();
        } else {
            setError('Invalid job domain data.');
            setLoading(false);
        }
    }, [domain, subDomain]);

    const sendEmail = useCallback(async (candidate) => {
        try {
            const response = await fetch(`${BACKEND_URL}/sendCandidateEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    candidateEmail: candidate.Email,
                    candidateName: candidate.Full_Name,
                    domain: candidate.Domain,
                    subDomain: candidate.Sub_Domain,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message || `Email sent to ${candidate.Full_Name}`);
            } else {
                alert(data.error || 'Failed to send email.');
            }
        } catch (err) {
            alert('Failed to send email. Please try again.');
            console.error('Send email error:', err);
        }
    }, []);

    if (loading) {
        return (
            <div className="text-center text-gray-600">
                Loading candidates...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 font-bold" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src="/logo.png"
                        alt="Talent Corner Logo"
                        className="h-12"
                        aria-hidden="true"
                    />
                    <h2 className="text-3xl font-bold text-[#5e239d] bg-gradient-to-r from-[#5e239d] to-[#4b1e84] bg-clip-text">
                        Candidates for {subDomain} ({domain})
                    </h2>
                </div>
                {candidates.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No matching candidates found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#5e239d] to-[#4b1e84] text-white">
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Name
                                    </th>
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Skills
                                    </th>
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Email
                                    </th>
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Phone
                                    </th>
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Email Status
                                    </th>
                                    <th
                                        className="p-3 text-left text-sm font-bold sticky top-0 bg-gradient-to-r from-[#5e239d] to-[#4b1e84]"
                                        scope="col"
                                    >
                                        Send Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((cand, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="p-3 text-sm text-gray-700">
                                            {cand.Full_Name}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {cand.Sub_Domain || 'N/A'}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {cand.Email}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {cand.Phone_No}
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {cand.email_status
                                                ? 'Sent'
                                                : 'Not Sent'}
                                        </td>
                                        <td className="p-3 text-sm">
                                            <button
                                                onClick={() => sendEmail(cand)}
                                                className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                disabled={cand.email_status}
                                                aria-label={`Send email to ${cand.Full_Name}`}
                                            >
                                                Send
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

CandidateResults.propTypes = {};

export default CandidateResults;
