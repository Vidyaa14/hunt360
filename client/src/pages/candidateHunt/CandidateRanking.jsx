/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const sampleData = [
    {
        id: 1,
        domain: 'Information Technology',
        subdomain: 'Software Developer',
        full_name: 'John Doe',
        email: 'john.doe@example.com',
        score: 85,
        status: 1,
    },
    {
        id: 2,
        domain: 'Healthcare',
        subdomain: 'Nurse',
        full_name: 'Jane Smith',
        email: 'jane.smith@example.com',
        score: 78,
        status: 0,
    },
    {
        id: 3,
        domain: 'Information Technology',
        subdomain: 'Data Analyst',
        full_name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        score: 92,
        status: 1,
    },
    {
        id: 4,
        domain: 'Finance',
        subdomain: 'Accountant',
        full_name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        score: 65,
        status: 2,
    },
    {
        id: 5,
        domain: 'Healthcare',
        subdomain: 'Doctor',
        full_name: 'Emily Brown',
        email: 'emily.brown@example.com',
        score: 88,
        status: 0,
    },
    {
        id: 6,
        domain: 'Marketing',
        subdomain: 'Digital Marketer',
        full_name: 'Michael Lee',
        email: 'michael.lee@example.com',
        score: 80,
        status: 1,
    },
];

const BACKEND_URL = `https://saarthi360-backend.vercel.app/api/candidate`;

const CandidateRanking = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [domainFilter, setDomainFilter] = useState('');
    const [subdomainFilter, setSubdomainFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/candidate-ranking`);
            const result = await res.json();
            console.log('Fetched candidate ranking:', result.rows);
            setData(result.rows || []);
        } catch (err) {
            console.error(err);
            // setData(sampleData);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            return (
                (!domainFilter || row.domain === domainFilter) &&
                (!subdomainFilter || row.subdomain === subdomainFilter)
            );
        });
    }, [data, domainFilter, subdomainFilter]);

    const uniqueDomains = [...new Set(data.map((item) => item.domain))];
    const uniqueSubdomains = [...new Set(data.map((item) => item.subdomain))];

    const handleDomainFilter = useCallback((e) => {
        setDomainFilter(e.target.value);
        setSubdomainFilter(''); // Reset subdomain when domain changes
    }, []);

    const handleSubdomainFilter = useCallback((e) => {
        setSubdomainFilter(e.target.value);
    }, []);

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-100">
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1 className="text-4xl font-bold text-[#5e239d] bg-gradient-to-r from-[#5e239d] to-[#4b1e84] bg-clip-text">
                        Candidate Ranking
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            onChange={handleDomainFilter}
                            value={domainFilter}
                            className="p-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#5e239d] focus:border-transparent bg-white"
                            aria-label="Filter by domain"
                        >
                            <option value="">All Domains</option>
                            {uniqueDomains.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain}
                                </option>
                            ))}
                        </select>
                        <select
                            onChange={handleSubdomainFilter}
                            value={subdomainFilter}
                            className="p-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#5e239d] focus:border-transparent bg-white"
                            aria-label="Filter by subdomain"
                        >
                            <option value="">All Subdomains</option>
                            {uniqueSubdomains.map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
                    {loading ? (
                        <p className="text-center text-gray-600">Loading data...</p>
                    ) : error ? (
                        <p className="text-center text-red-600 font-bold" role="alert">
                            {error}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#5e239d] text-white">
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Sr No
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Domain
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Subdomain
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Candidate
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Email
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Score
                                        </th>
                                        <th
                                            className="p-3 text-left text-sm font-bold sticky top-0 bg-[#5e239d]"
                                            scope="col"
                                        >
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-sm text-gray-700">{idx + 1}</td>
                                            <td className="p-3 text-sm text-gray-700">{row.domain}</td>
                                            <td className="p-3 text-sm text-gray-700">
                                                {row.subdomain}
                                            </td>
                                            <td className="p-3 text-sm text-gray-700">
                                                {row.full_name}
                                            </td>
                                            <td className="p-3 text-sm text-gray-700">{row.email}</td>
                                            <td className="p-3 text-sm text-gray-700">{row.score}</td>
                                            <td
                                                className={`p-3 text-sm font-bold ${row.status === 1
                                                    ? 'text-green-600'
                                                    : row.status === 2
                                                        ? 'text-red-600'
                                                        : 'text-orange-600'
                                                    }`}
                                            >
                                                {row.status === 1
                                                    ? 'Qualified'
                                                    : row.status === 2
                                                        ? 'Rejected'
                                                        : 'Pending'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

CandidateRanking.propTypes = {};

export default CandidateRanking;