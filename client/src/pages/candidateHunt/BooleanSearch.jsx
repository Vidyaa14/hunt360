/* eslint-disable no-unused-vars */
import { ArrowRight, Link, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';

const BACKEND_URL = 'https://saarthi360-backend.vercel.app/api/candidate';

const BooleanSearch = ({ isSidebarCollapsed = false }) => {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('Resume Search');
    const [location, setLocation] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('All Levels');
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    const handleOperatorClick = useCallback(
        (operator) => {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newQuery =
                query.slice(0, start) + operator + query.slice(end);
            setQuery(newQuery);
            textarea.focus();
            textarea.setSelectionRange(
                start + operator.length,
                start + operator.length
            );
        },
        [query]
    );

    const parseQuery = (query) => {
        // Simple parsing: assume query is like "(domain) AND (subDomain)"
        const match = query.match(/\((.*?)\)\s*AND\s*\((.*?)\)/i);
        if (match) {
            return { domain: match[1].trim(), subDomain: match[2].trim() };
        }
        return { domain: '', subDomain: '' };
    };

    const handleSearch = useCallback(
        async (e) => {
            e.preventDefault();
            setError('');
            setCandidates([]);
            setLoading(true);

            const { domain, subDomain } = parseQuery(query);

            if (!domain || !subDomain) {
                setError(
                    'Please provide a valid query in the format: (domain) AND (subDomain)'
                );
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${BACKEND_URL}/filterCandidates`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // Include session cookie
                        body: JSON.stringify({
                            domain,
                            subDomain,
                            searchType,
                            location,
                            experienceLevel,
                        }),
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
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        },
        [query, searchType, location, experienceLevel]
    );

    const tips = [
        {
            title: 'AND Operator',
            description:
                'Use AND to find results containing all specified terms.',
            icon: Link,
        },
        {
            title: 'OR Operator',
            description:
                'Use OR to find results containing any of the specified terms.',
            icon: ArrowRight,
        },
        {
            title: 'NOT Operator',
            description: 'Use NOT to exclude specific terms from results.',
            icon: XCircle,
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className={`flex-1 p-8 transition-all duration-300`}>
                <h1 className="text-3xl font-bold text-[#5e239d] mb-6">
                    Boolean Search
                </h1>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <textarea
                        ref={textareaRef}
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent resize-none"
                        placeholder="Enter your boolean search query (e.g., (Software) AND (JavaScript))"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Boolean search query"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                        {['AND', 'OR', 'NOT', '()', '**'].map((operator) => (
                            <button
                                key={operator}
                                onClick={() => handleOperatorClick(operator)}
                                className="px-4 py-2 bg-[#7e22ce] text-white rounded-md hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#7e22ce] focus:ring-opacity-50 transition-all duration-200"
                                aria-label={`Insert ${operator} operator`}
                            >
                                {operator}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-6 mt-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Search Type
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                aria-label="Search type"
                            >
                                <option>Resume Search</option>
                                <option>Profile Search</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent"
                                placeholder="Enter Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                aria-label="Location"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Experience Level
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent"
                                value={experienceLevel}
                                onChange={(e) =>
                                    setExperienceLevel(e.target.value)
                                }
                                aria-label="Experience level"
                            >
                                <option>All Levels</option>
                                <option>Entry</option>
                                <option>Mid</option>
                                <option>Senior</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-[#7e22ce] text-white rounded-lg font-semibold hover:bg-[#6b21a8] focus:ring-2 focus:ring-[#7e22ce] focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-400"
                            disabled={loading}
                            aria-label="Perform search"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {error && (
                        <p className="mt-4 text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                </div>

                {candidates.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-[#5e239d] mb-6">
                            Search Results
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-4 font-semibold">
                                            Name
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Email
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Phone
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Domain
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Sub-Domain
                                        </th>
                                        <th className="p-4 font-semibold">
                                            Email Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.map((candidate, index) => (
                                        <tr
                                            key={index}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-4">
                                                {candidate.Full_Name}
                                            </td>
                                            <td className="p-4">
                                                {candidate.Email}
                                            </td>
                                            <td className="p-4">
                                                {candidate.Phone_No}
                                            </td>
                                            <td className="p-4">
                                                {candidate.Domain}
                                            </td>
                                            <td className="p-4">
                                                {candidate.Sub_Domain}
                                            </td>
                                            <td className="p-4">
                                                {candidate.email_status
                                                    ? 'Sent'
                                                    : 'Not Sent'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-[#5e239d] mb-6">
                        Boolean Search Tips
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {tips.map((tip) => (
                            <div
                                key={tip.title}
                                className="flex-1 min-w-[200px]"
                            >
                                <div className="flex items-center mb-2">
                                    <tip.icon className="w-5 h-5 text-[#5e239d] mr-2" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        {tip.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {tip.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

BooleanSearch.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

BooleanSearch.defaultProps = {
    isSidebarCollapsed: false,
};

export default BooleanSearch;
